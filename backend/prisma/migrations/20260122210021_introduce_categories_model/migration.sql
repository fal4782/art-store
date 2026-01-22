/*
  Warnings:

  - You are about to drop the column `category` on the `artworks` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `artworks` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "artworks_category_idx";

-- AlterTable
ALTER TABLE "artworks" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ArtworkCategory";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "artworks_categoryId_idx" ON "artworks"("categoryId");

-- AddForeignKey
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
