import { Router } from "express";
import { prisma } from "../lib/prisma";
import { adminMiddleware, authMiddleware } from "../middleware";
import { CreateCategorySchema } from "../lib/types";

const router = Router();

// GET /categories - Public
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });
    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /categories - Admin only
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const parseResult = CreateCategorySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid request", errors: parseResult.error.issues });
  }

  try {
    const category = await prisma.category.create({
      data: parseResult.data,
    });
    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as categoryRouter };
