import { Router } from "express";
import express from "express";
import crypto from "crypto";
import { prisma } from "../lib/prisma";

const router = Router();

// NOTE: We always return 200 OK to Razorpay webhooks to acknowledge receipt otherwise
// Razorpay will keep retrying. We handle errors internally.

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = process.env.RAZORPAY_TEST_SECRET!;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body; // Buffer

    if (!signature) {
      console.warn("Missing Razorpay signature header");
      return res.status(400).json({ message: "Missing signature" });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("Invalid Razorpay signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Parse event
    let event;
    try {
      event = JSON.parse(body.toString());
    } catch (err) {
      console.error("Invalid JSON in webhook body");
      return res.status(400).json({ message: "Invalid JSON" });
    }

    if (event.event === "payment.captured") {
      const razorpayOrderId = event.payload.payment.entity.order_id;
      const razorpayPaymentId = event.payload.payment.entity.id;

      const order = await prisma.order.findFirst({
        where: { paymentIntentId: razorpayOrderId },
      });

      if (!order) {
        console.warn(
          "No matching order found for Razorpay order ID:",
          razorpayOrderId
        );
        return res.status(200).json({ status: "ok" });
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "COMPLETED", status: "CONFIRMED" },
      });

      await prisma.payment.create({
        data: {
          orderId: order.id,
          amountInPaise: event.payload.payment.entity.amount,
          currency: event.payload.payment.entity.currency,
          status: "COMPLETED",
          paymentGateway: "razorpay",
          gatewayPaymentId: razorpayPaymentId,
        },
      });
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ status: "ok" });
  }
);
export { router as paymentRouter };
