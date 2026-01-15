import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware";
import { CreateReviewSchema } from "../lib/types";

const router = Router();

router.get("/artworks/:id/reviews", async (req, res) => {
  const { id: artworkId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { artworkId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/artworks/:id/reviews", authMiddleware, async (req, res) => {
  const { id: artworkId } = req.params;
  const userId = req.userId;
  const parseResult = CreateReviewSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid request", errors: parseResult.error.issues });
  }
  try {
    // Check if artwork exists
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
    });
    if (!artwork || artwork.deletedAt) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    // Check if user already reviewed this artwork
    const existing = await prisma.review.findUnique({
      where: { userId_artworkId: { userId, artworkId } },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You have already reviewed this artwork" });
    }
    const review = await prisma.review.create({
      data: {
        userId,
        artworkId,
        ...parseResult.data,
      },
    });
    return res.status(201).json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete(
  "/artworks/:id/reviews/:reviewId",
  authMiddleware,
  async (req, res) => {
    const userId = req.userId;
    const { reviewId } = req.params;
    try {
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });
      if (!review || review.userId !== userId) {
        return res.status(404).json({ message: "Review not found" });
      }
      await prisma.review.delete({ where: { id: reviewId } });
      return res.json({ message: "Review deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as reviewRouter };
