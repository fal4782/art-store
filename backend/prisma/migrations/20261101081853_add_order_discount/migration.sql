-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discountCode" TEXT,
ADD COLUMN     "discountInPaise" INTEGER NOT NULL DEFAULT 0;
