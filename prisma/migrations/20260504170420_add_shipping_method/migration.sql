/*
  Warnings:

  - Added the required column `shippingMethod` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('REGULAR', 'NEXT_DAY', 'SAME_DAY');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingMethod" "ShippingMethod" NOT NULL;
