import { NextFunction, Request, Response } from "express";
import { prisma } from "./lib/prisma";
import jwt from "jsonwebtoken";
import "dotenv/config";

interface AuthJwtPayload {
  userId?: string;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const isBearer = authHeader.split(" ")[0] === "Bearer";
  if (!isBearer) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AuthJwtPayload;
    req.userId = decoded.userId as string;

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true },
    });
    req.isAdmin = user?.role === "ADMIN";

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  const isBearer = authHeader.split(" ")[0] === "Bearer";
  if (!isBearer) {
    return next();
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AuthJwtPayload;

    const userId = decoded.userId as string;

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // We only attach to the request if it exists
    if (user) {
      (req as any).userId = userId;
      req.isAdmin = user.role === "ADMIN";
    }

    next();
  } catch (error) {
    // If token is invalid, we just proceed as guest
    next();
  }
}

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const isAdmin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
        id: req.userId,
      },
    });
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Forbidden" });
  }
}
