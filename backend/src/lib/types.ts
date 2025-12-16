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
