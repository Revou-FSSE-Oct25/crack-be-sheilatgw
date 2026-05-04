/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPhone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPostalCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingProvince` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingRecipient` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `Order` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityRegency` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `shippingCost` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentMethod",
DROP COLUMN "shippingAddress",
DROP COLUMN "shippingCity",
DROP COLUMN "shippingPhone",
DROP COLUMN "shippingPostalCode",
DROP COLUMN "shippingProvince",
DROP COLUMN "shippingRecipient",
DROP COLUMN "trackingNumber",
ADD COLUMN     "addressId" INTEGER NOT NULL,
ADD COLUMN     "cityRegency" TEXT NOT NULL,
ADD COLUMN     "fullAddress" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "recipientName" TEXT NOT NULL,
ALTER COLUMN "shippingCost" SET NOT NULL,
ALTER COLUMN "shippingCost" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("address_id") ON DELETE RESTRICT ON UPDATE CASCADE;
