import { Router } from "express";
import { prisma } from "../lib/prisma";
import { adminMiddleware, authMiddleware } from "../middleware";

const router = Router();

router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [totalArtworks, totalOrders, totalUsers, revenueResult] = await Promise.all([
      prisma.artwork.count({ where: { deletedAt: null } }),
      prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
      prisma.user.count(),
      prisma.order.aggregate({
        where: { paymentStatus: "COMPLETED" },
        _sum: { totalPriceInPaise: true }
      })
    ]);

    const activeOrders = await prisma.order.count({
      where: { status: { in: ["PENDING", "CONFIRMED", "SHIPPED"] } }
    });

    return res.json({
      totalArtworks,
      totalOrders,
      totalUsers,
      totalRevenueInPaise: revenueResult._sum.totalPriceInPaise || 0,
      activeOrders
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as adminRouter };
