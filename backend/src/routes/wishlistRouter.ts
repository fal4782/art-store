import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware";
import { AddToWishlistSchema } from "../lib/types";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const wishlist = await prisma.wishlistItem.findMany({
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
    return res.json(wishlist);
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
  const parseResult = AddToWishlistSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid request", errors: parseResult.error.issues });
  }
  const { artworkId } = parseResult.data;
  try {
    // Check if artwork exists and is available
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
    });
    if (!artwork || artwork.deletedAt || !artwork.isAvailable) {
      return res.status(404).json({ message: "Artwork not available" });
    }
    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_artworkId: { userId, artworkId } },
    });
    if (existing) {
      return res.status(409).json({ message: "Artwork already in wishlist" });
    }
    const wishlistItem = await prisma.wishlistItem.create({
      data: { userId, artworkId },
    });
    return res.status(201).json(wishlistItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:itemId", authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { itemId } = req.params;
  try {
    // Check if wishlist item exists and belongs to user
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
    });
    if (!wishlistItem || wishlistItem.userId !== userId) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }
    await prisma.wishlistItem.delete({ where: { id: itemId } });
    return res.json({ message: "Wishlist item removed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
