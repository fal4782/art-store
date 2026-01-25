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
  lastName: z.string().optional(),
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
  firstName: z.string().min(1),
  lastName: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export const CreateAddressSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().default("India"),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof CreateAddressSchema>;

export const UpdateAddressSchema = CreateAddressSchema.partial();
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;

export const GetArtworksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum(["PHYSICAL", "DIGITAL", "BOTH"]).optional(),
  isAvailable: z.enum(["true", "false"]).optional(),
  isFeatured: z.enum(["true", "false"]).optional(),
  tag: z.string().optional(),
  sortBy: z.enum(["createdAt", "price", "views", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const CreateArtworkSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  type: z.enum(["PHYSICAL", "DIGITAL", "BOTH"]).default("PHYSICAL"),
  priceInPaise: z.number().int().min(0),
  dimensions: z.string().optional(),
  medium: z.string().optional(),
  filePath: z.string().nullable().optional(),
  stockQuantity: z.number().int().min(0).default(1),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isMadeToOrder: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]), // array of tag IDs
});
export type CreateArtworkInput = z.infer<typeof CreateArtworkSchema>;

export const UpdateArtworkSchema = CreateArtworkSchema.partial();
export type UpdateArtworkInput = z.infer<typeof UpdateArtworkSchema>;

export const CreateTagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});
export type CreateTagInput = z.infer<typeof CreateTagSchema>;

export const AddToCartSchema = z.object({
  artworkId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});
export type AddToCartInput = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
});
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;

export const AddToWishlistSchema = z.object({
  artworkId: z.string().min(1),
});
export type AddToWishlistInput = z.infer<typeof AddToWishlistSchema>;

export const PlaceOrderSchema = z.object({
  addressId: z.string().min(1),
  items: z.array(
    z.object({
      artworkId: z.string().min(1),
      quantity: z.number().int().min(1),
    })
  ),
  notes: z.string().optional(),
  discountCode: z.string().optional(),
});
export type PlaceOrderInput = z.infer<typeof PlaceOrderSchema>;

export type OrderItemData = {
  artworkId: string;
  quantity: number;
  priceInPaise: number;
  artworkName: string;
  artworkType: string;
  artworkDescription: string | null;
  artworkImage: string | null;
};

export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

export const CreateCategorySchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    image: z.string().optional(),
});
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const CreateDiscountSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").transform(val => val.toUpperCase().trim()),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(1, "Value must be positive"),
  minPurchaseInPaise: z.number().optional(),
  maxUses: z.number().optional(),
  isActive: z.boolean().optional(),
  validFrom: z.string().optional().transform(val => val ? new Date(val) : undefined),
  validUntil: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

export type CreateDiscountInput = z.infer<typeof CreateDiscountSchema>;

export const UpdateDiscountSchema = CreateDiscountSchema.partial();
export type UpdateDiscountInput = z.infer<typeof UpdateDiscountSchema>;

export const VerifyDiscountSchema = z.object({
  code: z.string().min(1),
  cartTotalInPaise: z.number().min(1),
});
export type VerifyDiscountInput = z.infer<typeof VerifyDiscountSchema>;