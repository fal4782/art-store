import { Router } from "express";
import express from "express";
import crypto from "crypto";
import { confirmOrderPayment } from "../lib/payments";

const router = Router();

// NOTE: We always return 200 OK to Razorpay webhooks to acknowledge receipt otherwise
// Razorpay will keep retrying. We handle errors internally.

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = process.env.RAZORPAY_TEST_SECRET!;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body; // Buffer (raw parser for this path runs in index.ts, before express.json())

    if (!Buffer.isBuffer(body)) {
      console.error("Webhook body was not raw; check parser order in index.ts");
      return res.status(500).json({ message: "Webhook misconfigured" });
    }

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
      const payment = event.payload.payment.entity;
      try {
        const result = await confirmOrderPayment({
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id,
          amountInPaise: payment.amount,
          currency: payment.currency,
        });
        if (!result) {
          console.warn(
            "No matching order found for Razorpay order ID:",
            payment.order_id,
          );
        }
      } catch (error) {
        // Confirmation is idempotent, so a non-2xx here just makes Razorpay retry.
        console.error("Webhook payment confirmation failed", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ status: "ok" });
  },
);
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const secret = process.env.RAZORPAY_TEST_SECRET!;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (razorpay_signature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    const result = await confirmOrderPayment({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      message: result.newlyConfirmed
        ? "Payment verified successfully"
        : "Payment already verified",
      order: result.order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as paymentRouter };
