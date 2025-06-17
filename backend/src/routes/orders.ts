import express from "express";
import { orderSchema } from "../utils/validation";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/middleware";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const orderData = orderSchema.parse(req.body);

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of orderData.items) {
      const artwork = await db.artwork.findUnique({
        where: { id: item.artworkId },
      });

      if (!artwork) {
        res.status(404).json({
          error: `Artwork with ID ${item.artworkId} not found`,
        });
        return;
      }

      if (!artwork.isAvailable) {
        res.status(400).json({
          error: `Artwork "${artwork.title}" is not available`,
        });
        return;
      }

      const itemTotal = Number(artwork.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        artworkId: item.artworkId,
        quantity: item.quantity,
        price: artwork.price,
      });
    }

    // Create order
    const order = await db.order.create({
      data: {
        status: "PENDING",
        totalAmount,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        notes: orderData.notes,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            artwork: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
      return;
    }
    console.error("Create order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all orders (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const orders = await db.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            artwork: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get order by ID (admin only)
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            artwork: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update order status (admin only)
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ];

      if (!validStatuses.includes(status)) {
        res.status(400).json({
          error: "Invalid status",
          validStatuses,
        });
        return;
      }

      const order = await db.order.findUnique({
        where: { id },
      });

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      const updatedOrder = await db.order.update({
        where: { id },
        data: { status },
        include: {
          orderItems: {
            include: {
              artwork: true,
            },
          },
        },
      });

      res.json({
        message: "Order status updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get user's orders (authenticated user)
router.get(
  "/user/my-orders",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const orders = await db.order.findMany({
        where: { userId: req.user!.id },
        include: {
          orderItems: {
            include: {
              artwork: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({ orders });
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
