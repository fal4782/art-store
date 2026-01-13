import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware";
import { AddToCartSchema } from "../lib/types";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        artwork: {
          include: {
            tags: { include: { tag: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(cartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const parseResult = AddToCartSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid request", errors: parseResult.error.issues });
  }
  const { artworkId, quantity } = parseResult.data;
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
    });
    if (!artwork || artwork.deletedAt || !artwork.isAvailable) {
      return res.status(404).json({ message: "Artwork not available" });
    }
    // Check if already in cart
    const existing = await prisma.cartItem.findUnique({
      where: { userId_artworkId: { userId, artworkId } },
    });
    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return res.status(200).json(updated);
    }
    // Add new cart item
    const cartItem = await prisma.cartItem.create({
      data: { userId, artworkId, quantity },
    });
    return res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
