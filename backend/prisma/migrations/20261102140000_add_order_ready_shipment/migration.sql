-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "readyShippedAt" TIMESTAMP(3),
ADD COLUMN     "readyTrackingNumber" TEXT;
