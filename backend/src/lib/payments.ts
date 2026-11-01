import { prisma } from "./prisma";

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

    // Conditional update: only one concurrent caller can win this.
    const { count } = await tx.order.updateMany({
      where: { id: order.id, paymentStatus: { not: "COMPLETED" } },
      data: { paymentStatus: "COMPLETED", status: "CONFIRMED" },
    });
    const newlyConfirmed = count === 1;

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
