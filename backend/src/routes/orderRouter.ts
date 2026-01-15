import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware";
import { OrderItemData, PlaceOrderSchema } from "../lib/types";
import { razorpay } from "../lib/razorpay";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
        payment: true,
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        payment: true,
        address: true,
      },
    });
    if (!order || order.userId !== userId) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const parseResult = PlaceOrderSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid request", errors: parseResult.error.issues });
  }
  const { addressId, items, notes, discountCode } = parseResult.data;

  try {
    // Validate address
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== userId) {
      return res.status(400).json({ message: "Invalid address" });
    }

    // Validate artworks, stock, and calculate total
    let totalPriceInPaise = 0;
    const orderItemsData: OrderItemData[] = [];
    for (const item of items) {
      const artwork = await prisma.artwork.findUnique({
        where: { id: item.artworkId },
      });
      if (!artwork || artwork.deletedAt || !artwork.isAvailable) {
        return res
          .status(400)
          .json({ message: `Artwork not available: ${item.artworkId}` });
      }
      if (artwork.type !== "DIGITAL" && artwork.stockQuantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for artwork: ${artwork.name}` });
      }
      totalPriceInPaise += artwork.priceInPaise * item.quantity;
      orderItemsData.push({
        artworkId: artwork.id,
        quantity: item.quantity,
        priceInPaise: artwork.priceInPaise,
        artworkName: artwork.name,
        artworkType: artwork.type,
        artworkDescription: artwork.description,
        artworkImage: artwork.images[0] || null,
      });
    }

    // TODO: Apply discount code logic here

    // Use Prisma transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create order and order items
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          status: "PENDING",
          paymentStatus: "PENDING",
          totalPriceInPaise,
          notes,
          shippingName: address.name,
          shippingAddressLine1: address.line1,
          shippingAddressLine2: address.line2,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPostalCode: address.postalCode,
          shippingCountry: address.country,
          shippingPhone: address.phone,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: true,
          address: true,
        },
      });

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: totalPriceInPaise,
        currency: "INR",
        receipt: order.id,
        payment_capture: true,
        notes: {
          userId,
          orderId: order.id,
        },
      });

      // Save razorpayOrder.id in your order (as paymentIntentId)
      await tx.order.update({
        where: { id: order.id },
        data: { paymentIntentId: razorpayOrder.id },
      });

      // Decrement stock for PHYSICAL or BOTH artworks
      for (const item of items) {
        const artwork = await tx.artwork.findUnique({
          where: { id: item.artworkId },
        });
        if (
          artwork &&
          (artwork.type === "PHYSICAL" || artwork.type === "BOTH")
        ) {
          await tx.artwork.update({
            where: { id: item.artworkId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return { order, razorpayOrder };
    });

    return res.status(201).json({
      order: result.order,
      razorpayOrder: {
        id: result.razorpayOrder.id,
        amount: result.razorpayOrder.amount,
        currency: result.razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as orderRouter };
