import { Router } from "express";
import { prisma } from "../lib/prisma";
import { GetArtworksQuerySchema } from "../lib/types";

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
    category,
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
    if (category) where.category = category;
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
    const artworksWithTags = artworks.map((artwork) => ({
      ...artwork,
      tags: artwork.tags.map((at) => at.tag),
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

export { router as artworkRouter };
