import { Router } from "express";
import { prisma } from "../lib/prisma";
import {
  CreateArtworkSchema,
  GetArtworksQuerySchema,
  HeroSlotsSchema,
  ReorderFeaturedSchema,
  UpdateArtworkSchema,
} from "../lib/types";
import {
  adminMiddleware,
  authMiddleware,
  optionalAuthMiddleware,
} from "../middleware";
import { digitalSalesEnabled, isHiddenDigital } from "../lib/config";

const router = Router();

/**
 * Position that puts an artwork first among the featured ones, so a newly
 * featured piece shows on the homepage straight away.
 */
async function topFeaturedPosition() {
  const first = await prisma.artwork.aggregate({
    where: { isFeatured: true, deletedAt: null },
    _min: { featuredPosition: true },
  });
  return (first._min.featuredPosition ?? 1) - 1;
}

router.get("/", optionalAuthMiddleware, async (req, res) => {
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
    if (isFeatured !== undefined) where.isFeatured = isFeatured === "true";

    // Visibility logic
    if (req.isAdmin) {
      if (isAvailable !== undefined) where.isAvailable = isAvailable === "true";
    } else {
      where.isAvailable = true;
    }
    // Hidden for everyone, admins included, while digital sales are off.
    if (!digitalSalesEnabled()) {
      where.AND = [{ type: { not: "DIGITAL" } }];
    }
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
    let orderBy: any = {};
    if (sortBy === "featuredPosition") {
      // Admin-chosen order; ties (e.g. never reordered) fall back to newest
      orderBy = [{ featuredPosition: "asc" }, { createdAt: "desc" }];
    } else if (sortBy === "price") {
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
          heroSlot: true,
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

/**
 * The artworks the admin picked for the homepage hero, in slot order. Only
 * ones customers can see are returned, so an unpublished pick just drops out.
 * Declared before "/:id" so "hero" isn't read as an artwork id.
 */
router.get("/hero", async (req, res) => {
  try {
    const artworks = await prisma.artwork.findMany({
      where: {
        heroSlot: { not: null },
        isAvailable: true,
        deletedAt: null,
        ...(!digitalSalesEnabled() && { type: { not: "DIGITAL" } }),
      },
      orderBy: { heroSlot: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        heroSlot: true,
        isFeatured: true,
      },
    });
    return res.json(artworks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Sets all three hero slots at once. Each pick must be a published artwork
 * customers can see, and the same artwork can't take two slots.
 */
router.put("/hero-slots", authMiddleware, adminMiddleware, async (req, res) => {
  const parseResult = HeroSlotsSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parseResult.error.issues,
    });
  }
  const { slots } = parseResult.data;
  const ids = slots.filter((id): id is string => id !== null);

  if (new Set(ids).size !== ids.length) {
    return res
      .status(400)
      .json({ message: "An artwork can only be in one hero slot" });
  }

  try {
    const valid = await prisma.artwork.count({
      where: {
        id: { in: ids },
        isAvailable: true,
        deletedAt: null,
        ...(!digitalSalesEnabled() && { type: { not: "DIGITAL" } }),
      },
    });
    if (valid !== ids.length) {
      return res.status(400).json({
        message: "Hero picks must be published artworks",
      });
    }

    // Clear first so the unique heroSlot never clashes mid-update
    await prisma.$transaction([
      prisma.artwork.updateMany({
        where: { heroSlot: { not: null } },
        data: { heroSlot: null },
      }),
      ...slots.flatMap((id, index) =>
        id
          ? [
              prisma.artwork.update({
                where: { id },
                data: { heroSlot: index + 1 },
              }),
            ]
          : [],
      ),
    ]);
    return res.json({ message: "Hero saved" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/slug/:slug", optionalAuthMiddleware, async (req, res) => {
  const { slug } = req.params;
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!artwork || artwork.deletedAt) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    if (
      isHiddenDigital(artwork.type) ||
      (!artwork.isAvailable && !req.isAdmin)
    ) {
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

router.get("/:id", optionalAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    if (!artwork || artwork.deletedAt) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    if (
      isHiddenDigital(artwork.type) ||
      (!artwork.isAvailable && !req.isAdmin)
    ) {
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
        ...(data.isFeatured && {
          featuredPosition: await topFeaturedPosition(),
        }),
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

/**
 * Saves the homepage order of featured artworks. Takes every featured artwork
 * the admin can see, in order; a list that doesn't match (e.g. changed in
 * another tab) is rejected rather than saving a partial order.
 */
router.put(
  "/featured-order",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const parseResult = ReorderFeaturedSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parseResult.error.issues,
      });
    }
    const { ids } = parseResult.data;

    try {
      const featured = await prisma.artwork.findMany({
        where: {
          isFeatured: true,
          deletedAt: null,
          // Hidden digital pieces aren't in the admin's list; leave them be
          ...(!digitalSalesEnabled() && { type: { not: "DIGITAL" } }),
        },
        select: { id: true },
      });
      const featuredIds = new Set(featured.map((a) => a.id));
      const matches =
        ids.length === featuredIds.size &&
        new Set(ids).size === ids.length &&
        ids.every((id) => featuredIds.has(id));
      if (!matches) {
        return res.status(409).json({
          message: "The featured artworks changed. Reload and try again.",
        });
      }

      await prisma.$transaction(
        ids.map((id, index) =>
          prisma.artwork.update({
            where: { id },
            data: { featuredPosition: index },
          }),
        ),
      );
      return res.json({ message: "Featured order saved" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

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

    const newlyFeatured =
      parseResult.data.isFeatured === true && !artwork.isFeatured;

    const updatedArtwork = await prisma.artwork.update({
      where: { id },
      data: {
        ...parseResult.data,
        ...(newlyFeatured && {
          featuredPosition: await topFeaturedPosition(),
        }),
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
      data: { deletedAt: new Date(), heroSlot: null },
    });
    return res.json({ message: "Artwork deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as artworkRouter };
