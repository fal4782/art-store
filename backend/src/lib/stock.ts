import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

// Stock is reserved when an order is placed, before payment. Unpaid orders
// release it again: immediately when the customer closes the Razorpay popup,
// or after this long as a fallback (the popup itself times out after 15 min).
export const RESERVATION_MINUTES = 30;

export const hasStock = (artworkType: string) =>
  artworkType === "PHYSICAL" || artworkType === "BOTH";

/**
 * For made-to-order pieces: takes up to `wanted` ready copies from stock and
 * returns how many it took. The rest are made after ordering, so stock never
 * goes below 0. The update only applies if stock hasn't changed since it was
 * read, so two concurrent checkouts can't both take the last ready copy.
 */
export async function takeReadyCopies(
  tx: Prisma.TransactionClient,
  artworkId: string,
  wanted: number,
) {
  for (;;) {
    const { stockQuantity } = await tx.artwork.findUniqueOrThrow({
      where: { id: artworkId },
      select: { stockQuantity: true },
    });
    const take = Math.min(Math.max(stockQuantity, 0), wanted);
    if (take === 0) return 0;
    const { count } = await tx.artwork.updateMany({
      where: { id: artworkId, stockQuantity },
      data: { stockQuantity: { decrement: take } },
    });
    if (count === 1) return take;
  }
}

/**
 * Cancels an order and puts its stock back, but only if it still matches
 * `expected`. Returns false and changes nothing otherwise, so it is safe to
 * race against payment confirmation or another admin action.
 */
async function cancelAndRestock(
  orderId: string,
  expected: Prisma.OrderWhereInput,
  reason: string,
) {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, ...expected },
      data: {
        status: "CANCELLED",
        cancelReason: reason,
        cancelledAt: new Date(),
      },
    });
    if (count === 0) return false;

    // Once the ready copies have shipped, everything that came from stock
    // has left, so there's nothing to put back.
    const { readyShippedAt } = await tx.order.findUniqueOrThrow({
      where: { id: orderId },
      select: { readyShippedAt: true },
    });
    if (readyShippedAt) return true;

    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of items) {
      if (!hasStock(item.artworkType)) continue;
      // Made-to-order units never came out of stock, so only return the rest.
      const fromStock = item.quantity - item.madeToOrderQuantity;
      if (fromStock === 0) continue;
      await tx.artwork.update({
        where: { id: item.artworkId },
        data: { stockQuantity: { increment: fromStock } },
      });
    }
    return true;
  });
}

/** Cancels an order still awaiting payment and puts its stock back. */
export const releaseUnpaidOrder = (orderId: string, reason: string) =>
  cancelAndRestock(
    orderId,
    { status: "PENDING", paymentStatus: "PENDING" },
    reason,
  );

/**
 * Cancels a paid order that hasn't shipped and puts its stock back. The
 * refund itself is issued manually from the Razorpay dashboard.
 */
export const cancelPaidOrder = (orderId: string, reason: string) =>
  cancelAndRestock(orderId, { status: "CONFIRMED" }, reason);

export async function releaseExpiredOrders() {
  const cutoff = new Date(Date.now() - RESERVATION_MINUTES * 60 * 1000);
  const expired = await prisma.order.findMany({
    where: {
      status: "PENDING",
      paymentStatus: "PENDING",
      createdAt: { lt: cutoff },
    },
    select: { id: true },
  });
  for (const { id } of expired) {
    await releaseUnpaidOrder(id, "Payment not completed in time");
  }
  return expired.length;
}
