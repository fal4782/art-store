import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, optionalAuthMiddleware } from "../middleware";
import { OrderItemData, PlaceOrderSchema } from "../lib/types";
import { razorpay } from "../lib/razorpay";
import { hasStock, releaseUnpaidOrder } from "../lib/stock";
import {
  DiscountError,
  discountedTotal,
  validateDiscount,
} from "../lib/discounts";

const router = Router();

class OutOfStockError extends Error {
  constructor(artworkName: string) {
    super(`Insufficient stock for artwork: ${artworkName}`);
  }
}

router.get("/", optionalAuthMiddleware, async (req, res) => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;

    const where: any = {};
    if (!req.isAdmin) {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      where.userId = req.userId;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: req.isAdmin
          ? {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            }
          : false,
        orderItems: {
          include: {
            artwork: {
              select: { slug: true },
            },
          },
        },
        payment: true,
        address: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
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

    let discountInPaise = 0;
    let appliedDiscountCode: string | null = null;
    if (discountCode) {
      try {
        const discount = await validateDiscount(
          discountCode,
          totalPriceInPaise,
        );
        discountInPaise =
          totalPriceInPaise - discountedTotal(discount, totalPriceInPaise);
        appliedDiscountCode = discount.code;
      } catch (error) {
        if (error instanceof DiscountError) {
          return res.status(400).json({ message: error.message });
        }
        throw error;
      }
    }

    const amountToChargeInPaise = totalPriceInPaise - discountInPaise;
    // Razorpay rejects orders below 100 paise.
    if (amountToChargeInPaise < 100) {
      return res
        .status(400)
        .json({ message: "Order total after discount must be at least ₹1" });
    }

    // Use Prisma transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create order and order items
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          status: "PENDING",
          paymentStatus: "PENDING",
          totalPriceInPaise: amountToChargeInPaise,
          discountCode: appliedDiscountCode,
          discountInPaise,
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
        amount: amountToChargeInPaise,
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

      // Reserve stock for PHYSICAL or BOTH artworks. The conditional update
      // stops two concurrent checkouts from both taking the last piece.
      for (const item of orderItemsData) {
        if (!hasStock(item.artworkType)) continue;
        const { count } = await tx.artwork.updateMany({
          where: {
            id: item.artworkId,
            stockQuantity: { gte: item.quantity },
          },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (count === 0) throw new OutOfStockError(item.artworkName);
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
    if (error instanceof OutOfStockError) {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Called when the customer closes the Razorpay popup without paying.
router.post("/:id/cancel", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || order.userId !== req.userId) {
      return res.status(404).json({ message: "Order not found" });
    }
    const released = await releaseUnpaidOrder(
      id,
      "Checkout closed before payment",
    );
    if (!released) {
      return res
        .status(409)
        .json({ message: "Order is no longer awaiting payment" });
    }
    return res.json({ message: "Order cancelled" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as orderRouter };
