/*
  Warnings:

  - Made the column `characterId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seriesId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `manufacturerId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_manufacturerId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_seriesId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "characterId" SET NOT NULL,
ALTER COLUMN "seriesId" SET NOT NULL,
ALTER COLUMN "manufacturerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("chara_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("manuf_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("series_id") ON DELETE RESTRICT ON UPDATE CASCADE;
