/*
  Warnings:

  - You are about to drop the column `priceSnapshot` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `remainingAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "remainingAmount" INTEGER NOT NULL,
ADD COLUMN     "totalDiscount" INTEGER;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "priceSnapshot",
ADD COLUMN     "discount" INTEGER,
ADD COLUMN     "fullPrice" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
