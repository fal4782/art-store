import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const artworkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  category: z.enum(["PAINTING", "CROCHET", "DRAWING", "DIGITAL_ART"], {
    errorMap: () => ({ message: "Invalid art category" }),
  }),
  dimensions: z.string().optional(),
  medium: z.string().optional(),
  isAvailable: z.boolean().default(true),
  images: z.array(z.string().url()).default([]),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        artworkId: z.string().uuid("Invalid artwork ID"),
        quantity: z
          .number()
          .int()
          .positive("Quantity must be positive")
          .default(1),
      })
    )
    .min(1, "At least one item is required"),
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Invalid email format"),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  notes: z.string().optional(),
});
