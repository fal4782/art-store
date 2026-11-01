import { prisma } from "./prisma";

// Stock is reserved when an order is placed, before payment. Unpaid orders
// release it again: immediately when the customer closes the Razorpay popup,
// or after this long as a fallback (the popup itself times out after 15 min).
export const RESERVATION_MINUTES = 30;

export const hasStock = (artworkType: string) =>
  artworkType === "PHYSICAL" || artworkType === "BOTH";

/**
 * Cancels an order that is still awaiting payment and puts its stock back.
 * Does nothing (returns false) if the order was paid or already cancelled,
 * so it is safe to race against payment confirmation.
 */
export async function releaseUnpaidOrder(orderId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: "PENDING", paymentStatus: "PENDING" },
      data: {
        status: "CANCELLED",
        cancelReason: reason,
        cancelledAt: new Date(),
      },
    });
    if (count === 0) return false;

    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of items) {
      if (!hasStock(item.artworkType)) continue;
      await tx.artwork.update({
        where: { id: item.artworkId },
        data: { stockQuantity: { increment: item.quantity } },
      });
    }
    return true;
  });
}

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
