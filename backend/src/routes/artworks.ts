import express from "express";
import { artworkSchema } from "../utils/validation";
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";

import { authenticateToken, requireAdmin } from "../middleware/middleware";

const db = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { available } = req.query;

    const where: any = {};
    if (available === "true") {
      where.isAvailable = true;
    }

    const artworks = await db.artwork.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({ artworks });
  } catch (error) {
    console.error("Get artworks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// TODO: More explicit types for req and res

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const artwork = await db.artwork.findUnique({
      where: { id },
    });

    if (!artwork) {
      res.status(404).json({ error: "Artwork not found" });
      return;
    }

    res.json({ artwork });
  } catch (error) {
    console.error("Get artwork error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create artwork (admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const data = artworkSchema.parse(req.body);

    const artwork = await db.artwork.create({
      data,
    });

    res.status(201).json({
      message: "Artwork created successfully",
      artwork,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
      return;
    }
    console.error("Create artwork error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update artwork (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = artworkSchema.partial().parse(req.body);

    // Check if artwork exists
    const existingArtwork = await db.artwork.findUnique({
      where: { id },
    });

    if (!existingArtwork) {
      res.status(404).json({ error: "Artwork not found" });
      return;
    }

    const artwork = await db.artwork.update({
      where: { id },
      data,
    });

    res.json({
      message: "Artwork updated successfully",
      artwork,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
      return;
    }
    console.error("Update artwork error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete artwork (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const artwork = await db.artwork.findUnique({
      where: { id },
    });

    if (!artwork) {
      res.status(404).json({ error: "Artwork not found" });
      return;
    }

    await db.artwork.delete({
      where: { id },
    });

    res.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    console.error("Delete artwork error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
