import { DiscountCode } from "@prisma/client";
import { prisma } from "./prisma";

export class DiscountError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Looks up a discount code and checks it can be used on a cart of the given
 * total. Throws DiscountError with a customer-facing message if not.
 */
export async function validateDiscount(
  code: string,
  cartTotalInPaise: number,
): Promise<DiscountCode> {
  const discount = await prisma.discountCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!discount) {
    throw new DiscountError(404, "Invalid discount code");
  }

  if (!discount.isActive) {
    throw new DiscountError(400, "Discount code is inactive");
  }

  const now = new Date();
  if (discount.validFrom > now) {
    throw new DiscountError(400, "Discount code is not yet valid");
  }

  if (discount.validUntil && discount.validUntil < now) {
    throw new DiscountError(400, "Discount code has expired");
  }

  if (discount.maxUses && discount.usedCount >= discount.maxUses) {
    throw new DiscountError(400, "Discount usage limit reached");
  }

  if (
    discount.minPurchaseInPaise &&
    cartTotalInPaise < discount.minPurchaseInPaise
  ) {
    throw new DiscountError(
      400,
      `Minimum purchase amount of ₹${discount.minPurchaseInPaise / 100} required`,
    );
  }

  return discount;
}

/**
 * Total after applying the discount. Must match the calculation in the
 * frontend's CheckoutPage so the amount charged equals the amount shown.
 */
export function discountedTotal(
  discount: Pick<DiscountCode, "discountType" | "discountValue">,
  totalInPaise: number,
): number {
  if (discount.discountType === "PERCENTAGE") {
    return Math.round(
      totalInPaise - (totalInPaise * discount.discountValue) / 100,
    );
  }
  return Math.max(0, totalInPaise - discount.discountValue);
}
