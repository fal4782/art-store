import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware";
import { CreateAddressSchema, UpdateAddressSchema } from "../lib/types";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const addresses = await prisma.address.findMany({ where: { userId } });
    return res.json(addresses);
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
  const parseResult = CreateAddressSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parseResult.error.issues,
    });
  }
  try {
    if (parseResult.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    const address = await prisma.address.create({
      data: { ...parseResult.data, userId },
    });
    return res.status(201).json(address);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  const parseResult = UpdateAddressSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parseResult.error.issues,
    });
  }
  try {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) {
      return res.status(404).json({ message: "Address not found" });
    }
    if (parseResult.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    const updated = await prisma.address.update({
      where: { id },
      data: parseResult.data,
    });
    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  try {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) {
      return res.status(404).json({ message: "Address not found" });
    }
    await prisma.address.delete({ where: { id } });
    return res.json({ message: "Address deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
export { router as addressRouter };
