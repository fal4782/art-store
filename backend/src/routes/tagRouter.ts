import { Router } from "express";
import { CreateTagSchema } from "../lib/types.js";
import { prisma } from "../lib/prisma";
import { authMiddleware, adminMiddleware } from "../middleware.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(tags);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const parseResult = CreateTagSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parseResult.error.issues });
  }
  const data = parseResult.data;
  try {
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
      },
    });
    if (existingTag) {
      return res
        .status(409)
        .json({ message: "Tag with the same name or slug already exists" });
    }
    const tag = await prisma.tag.create({ data });
    return res.status(201).json(tag);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", adminMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    await prisma.tag.delete({
      where: { id },
    });
    return res.json({ message: "Tag deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as tagRouter };
