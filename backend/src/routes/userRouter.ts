import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { authMiddleware, adminMiddleware } from "../middleware";
import {
  ChangePasswordSchema,
  GetUsersQuerySchema,
  UpdateProfileSchema,
} from "../lib/types";

const router = Router();

// Current user routes

router.get("/me", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/me", authMiddleware, async (req, res) => {
  const parseResult = UpdateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request",
      errors: parseResult.error.issues,
    });
  }
  const userId = req.userId;
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: parseResult.data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/me/password", authMiddleware, async (req, res) => {
  const parseResult = ChangePasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request",
      errors: parseResult.error.issues,
    });
  }
  const { oldPassword, newPassword } = parseResult.data;
  const userId = req.userId;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/me/deactivate", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
    return res.json({ message: "Account deactivated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/me/reactivate", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isActive) {
      return res.status(400).json({ message: "Account is already active" });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });
    return res.json({ message: "Account reactivated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Admin routes

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  const parseResult = GetUsersQuerySchema.safeParse(req.query);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: parseResult.error.issues,
    });
  }

  const { page, limit, search, role, isActive } = parseResult.data;

  try {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Fetch users and count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      users,
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

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//  Delete user (BY ADMIN)
router.patch(
  "/:id/deactivate",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
      return res.json({ message: "User deactivated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as userRouter };
