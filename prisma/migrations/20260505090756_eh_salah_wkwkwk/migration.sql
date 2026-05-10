/*
  Warnings:

  - You are about to drop the column `seriesId` on the `Character` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_seriesId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "seriesId";
