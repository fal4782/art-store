import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1).optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const GetUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
  isActive: z.enum(["true", "false"]).optional(),
});
export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>;

export const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  role: z.enum(["ADMIN", "CUSTOMER"]),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export const GetArtworksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional(),
  category: z
    .enum(["PAINTING", "CROCHET", "DRAWING", "DIGITAL_ART"])
    .optional(),
  type: z.enum(["PHYSICAL", "DIGITAL", "BOTH"]).optional(),
  isAvailable: z.enum(["true", "false"]).optional(),
  isFeatured: z.enum(["true", "false"]).optional(),
  tag: z.string().optional(),
  sortBy: z.enum(["createdAt", "price", "views", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const ArtworkResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  category: z.enum(["PAINTING", "CROCHET", "DRAWING", "DIGITAL_ART"]),
  type: z.enum(["PHYSICAL", "DIGITAL", "BOTH"]),
  priceInPaise: z.number(),
  dimensions: z.string().nullable(),
  medium: z.string().nullable(),
  stockQuantity: z.number(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  isMadeToOrder: z.boolean(),
  images: z.array(z.string()),
  views: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
  ),
});
