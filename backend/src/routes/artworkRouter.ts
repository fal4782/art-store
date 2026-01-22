import { Router } from "express";
import { prisma } from "../lib/prisma";
import {
  CreateArtworkSchema,
  GetArtworksQuerySchema,
  UpdateArtworkSchema,
} from "../lib/types";
import { adminMiddleware, authMiddleware } from "../middleware";

const router = Router();

router.get("/", async (req, res) => {
  const parseResult = GetArtworksQuerySchema.safeParse(req.query);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: parseResult.error.message,
    });
  }

  const {
    page,
    limit,
    search,
    categoryId,
    type,
    isAvailable,
    isFeatured,
    tag,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = parseResult.data;

  try {
    const skip = (page - 1) * limit;
    const where: any = {
      deletedAt: null, // Don't show soft-deleted artworks
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { medium: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (type) where.type = type;
    if (isAvailable !== undefined) where.isAvailable = isAvailable === "true";
    if (isFeatured !== undefined) where.isFeatured = isFeatured === "true";
    if (tag) {
      where.tags = {
        some: {
          tag: {
            OR: [
              { name: { equals: tag, mode: "insensitive" } },
              { slug: { equals: tag, mode: "insensitive" } },
            ],
          },
        },
      };
    }

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === "price") {
      orderBy.priceInPaise = sortOrder;
    } else if (sortBy === "views") {
      orderBy.views = sortOrder;
    } else if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          categoryId: true,
          type: true,
          priceInPaise: true,
          dimensions: true,
          medium: true,
          stockQuantity: true,
          isAvailable: true,
          isFeatured: true,
          isMadeToOrder: true,
          images: true,
          views: true,
          createdAt: true,
          updatedAt: true,
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      prisma.artwork.count({ where }),
    ]);


    // Transform tags to simpler format
    const artworksWithTags = artworks.map((artwork: any) => ({
      ...artwork,
      tags: artwork.tags.map((at: any) => at.tag),
    }));

    return res.json({
      artworks: artworksWithTags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/slug/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!artwork || artwork.deletedAt) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // Transform tags to simpler format
    const artworkWithTags = {
      ...artwork,
      tags: artwork.tags.map((at: any) => at.tag),
    };

    return res.json(artworkWithTags);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
    if (!artwork || artwork.deletedAt) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    // Transform tags to simpler format
    const artworkWithTags = {
      ...artwork,
      tags: artwork.tags.map((at: any) => at.tag),
    };
    return res.json(artworkWithTags);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const parsedResult = CreateArtworkSchema.safeParse(req.body);
  if (!parsedResult.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsedResult.error.issues,
    });
  }
  const data = parsedResult.data;
  try {
    const existing = await prisma.artwork.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });
    if (existing) {
      return res.status(409).json({ message: "Artwork slug already exists" });
    }

    const artwork = await prisma.artwork.create({
      data: {
        ...data,
        tags: {
          create: data.tags.map((tagId: string) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
    const artworkWithTags = {
      ...artwork,
      tags: artwork.tags.map((at) => at.tag),
    };
    return res.status(201).json(artworkWithTags);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const parseResult = UpdateArtworkSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parseResult.error.issues,
    });
  }

  try {
    const artwork = await prisma.artwork.findUnique({ where: { id } });
    if (!artwork || artwork.deletedAt) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // Handle tags update if present
    let tagsUpdate = undefined;
    if (parseResult.data.tags) {
      tagsUpdate = {
        // Remove all existing tags and add new ones
        deleteMany: {},
        create: parseResult.data.tags.map((tagId: string) => ({
          tag: { connect: { id: tagId } },
        })),
      };
    }

    const updatedArtwork = await prisma.artwork.update({
      where: { id },
      data: {
        ...parseResult.data,
        tags: tagsUpdate,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    return res.json(updatedArtwork);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      select: { deletedAt: true },
    });
    if (!artwork || artwork.deletedAt) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    await prisma.artwork.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return res.json({ message: "Artwork deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as artworkRouter };
