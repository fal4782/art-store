import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, adminMiddleware } from "../middleware";

const router = Router();

import { CreateDiscountSchema, UpdateDiscountSchema, VerifyDiscountSchema } from "../lib/types";

// Admin Endpoints

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const parseResult = CreateDiscountSchema.safeParse(req.body);
    if(!parseResult.success){
      return res.status(400).json({ message: "Invalid request", errors: parseResult.error.issues });
    }
    const data = parseResult.data;
    // Check if code exists
    const existing = await prisma.discountCode.findUnique({
      where: { code: data.code.toUpperCase() } // Ensure code is uppercase for uniqueness check
    });

    if (existing) {
      return res.status(400).json({ message: "Discount code already exists" });
    }

    const discount = await prisma.discountCode.create({
      data: {
        ...data,
        code: data.code.toUpperCase(), // Store code in uppercase
        discountValue: Number(data.discountValue),
        minPurchaseInPaise: data.minPurchaseInPaise ? Number(data.minPurchaseInPaise) : null,
        maxUses: data.maxUses ? Number(data.maxUses) : null,
        validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });

    res.status(201).json(discount);
  } catch (error: any) {
    if (error.errors) {
       return res.status(400).json({ message: error.errors[0].message });
    }
    console.error("Create discount error:", error);
    res.status(500).json({ message: "Failed to create discount" });
  }
});

// Update discount code
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const parseResult = UpdateDiscountSchema.safeParse(req.body);
    if(!parseResult.success){
      return res.status(400).json({ message: "Invalid request", errors: parseResult.error.issues });
    }
    const data = parseResult.data;

    const updateData: any = { ...data };

    if (data.code) {
      updateData.code = data.code.toUpperCase();
    }
    if (data.discountValue !== undefined) {
      updateData.discountValue = Number(data.discountValue);
    }
    if (data.minPurchaseInPaise !== undefined) {
      updateData.minPurchaseInPaise = data.minPurchaseInPaise ? Number(data.minPurchaseInPaise) : null;
    }
    if (data.maxUses !== undefined) {
      updateData.maxUses = data.maxUses ? Number(data.maxUses) : null;
    }
    if (data.validFrom !== undefined) {
      updateData.validFrom = data.validFrom ? new Date(data.validFrom) : new Date();
    }
    if (data.validUntil !== undefined) {
      updateData.validUntil = data.validUntil ? new Date(data.validUntil) : null;
    }
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    const discount = await prisma.discountCode.update({
      where: { id },
      data: updateData
    });

    res.json(discount);
  } catch (error: any) {
    if (error.errors) {
       return res.status(400).json({ message: error.errors[0].message });
    }
    console.error("Update discount error:", error);
    res.status(500).json({ message: "Failed to update discount" });
  }
});

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const discounts = await prisma.discountCode.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(discounts);
  } catch (error) {
    console.error("List discounts error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.discountCode.delete({
      where: { id }
    });
    res.json({ message: "Discount deleted successfully" });
  } catch (error) {
    console.error("Delete discount error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Public Endpoints

router.get("/public", async (req, res) => {
  try {
    const now = new Date();
    const discounts = await prisma.discountCode.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        OR: [
          { validUntil: null },
          { validUntil: { gte: now } }
        ],
        // TODO: Filter by maxUses to show only those with remaining uses
      },
      select: {
        code: true,
        description: true,
        discountType: true,
        discountValue: true
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(discounts);
  } catch (error) {
    console.error("Public discounts error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const parseResult = VerifyDiscountSchema.safeParse(req.body);
    if(!parseResult.success){
      return res.status(400).json({ message: "Invalid request", errors: parseResult.error.issues });
    }
    const { code, cartTotalInPaise } = parseResult.data;
    
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    if (!cartTotalInPaise) {
      return res.status(400).json({ message: "Cart total is required" });
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!discount) {
      return res.status(404).json({ message: "Invalid discount code" });
    }

    if (!discount.isActive) {
      return res.status(400).json({ message: "Discount code is inactive" });
    }

    const now = new Date();
    if (discount.validFrom > now) {
      return res.status(400).json({ message: "Discount code is not yet valid" });
    }

    if (discount.validUntil && discount.validUntil < now) {
      return res.status(400).json({ message: "Discount code has expired" });
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return res.status(400).json({ message: "Discount usage limit reached" });
    }

    if (discount.minPurchaseInPaise && cartTotalInPaise < discount.minPurchaseInPaise) {
      return res.status(400).json({ 
        message: `Minimum purchase amount of ₹${discount.minPurchaseInPaise / 100} required` 
      });
    }

    res.json({
      id: discount.id,
      code: discount.code,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      description: discount.description,
      minPurchaseInPaise: discount.minPurchaseInPaise
    });
  } catch (error) {
    console.error("Verify discount error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as discountRouter };
