/*
  Warnings:

  - Added the required column `seriesId` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "seriesId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("series_id") ON DELETE RESTRICT ON UPDATE CASCADE;
