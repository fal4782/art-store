import { prisma } from "./prisma";
import { hasStock } from "./stock";

interface ConfirmPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amountInPaise?: number;
  currency?: string;
}

/**
 * Marks an order as paid. Safe to call more than once for the same order:
 * both the client-side /verify call and the Razorpay webhook end up here, in
 * either order and possibly at the same time.
 *
 * `newlyConfirmed` is true only for the call that actually flipped the order
 * to COMPLETED, so one-time side effects can hang off it.
 */
export async function confirmOrderPayment({
  razorpayOrderId,
  razorpayPaymentId,
  amountInPaise,
  currency = "INR",
}: ConfirmPaymentInput) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { paymentIntentId: razorpayOrderId },
    });
    if (!order) return null;

    // Conditional updates: only one concurrent caller can win these.
    // First, a payment that landed after the unpaid order was released
    // (e.g. a slow UPI approval): revive the order and take its stock again.
    const revived = await tx.order.updateMany({
      where: {
        id: order.id,
        status: "CANCELLED",
        paymentStatus: { not: "COMPLETED" },
      },
      data: {
        paymentStatus: "COMPLETED",
        status: "CONFIRMED",
        cancelReason: null,
        cancelledAt: null,
      },
    });
    if (revived.count === 1) {
      const items = await tx.orderItem.findMany({
        where: { orderId: order.id },
      });
      for (const item of items) {
        if (!hasStock(item.artworkType)) continue;
        const artwork = await tx.artwork.update({
          where: { id: item.artworkId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (artwork.stockQuantity < 0) {
          console.warn(
            `Oversold "${artwork.name}" (stock ${artwork.stockQuantity}) after late payment on order ${order.id}`,
          );
        }
      }
    }

    const { count } = await tx.order.updateMany({
      where: { id: order.id, paymentStatus: { not: "COMPLETED" } },
      data: { paymentStatus: "COMPLETED", status: "CONFIRMED" },
    });
    const newlyConfirmed = count === 1 || revived.count === 1;

    // Count a discount use only once the order is actually paid.
    if (newlyConfirmed && order.discountCode) {
      await tx.discountCode.updateMany({
        where: { code: order.discountCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    const payment = {
      amountInPaise: amountInPaise ?? order.totalPriceInPaise,
      currency,
      status: "COMPLETED" as const,
      paymentGateway: "razorpay",
      gatewayPaymentId: razorpayPaymentId,
    };
    await tx.payment.upsert({
      where: { orderId: order.id },
      create: { orderId: order.id, ...payment },
      update: payment,
    });

    const updatedOrder = await tx.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    return { order: updatedOrder, newlyConfirmed };
  });
}
