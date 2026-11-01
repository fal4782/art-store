-- AlterTable
ALTER TABLE "artworks" ADD COLUMN     "heroSlot" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "artworks_heroSlot_key" ON "artworks"("heroSlot");
