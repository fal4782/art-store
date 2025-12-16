import { NextFunction, Request, Response } from "express";
import { prisma } from "./lib/prisma";
import jwt from "jsonwebtoken";
import "dotenv/config";

interface AuthJwtPayload {
  userId?: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
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
      process.env.JWT_SECRET as string
    ) as AuthJwtPayload;
    req.userId = decoded.userId as string;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
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
