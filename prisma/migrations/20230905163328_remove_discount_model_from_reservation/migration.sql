/*
  Warnings:

  - You are about to drop the column `discountId` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `discount` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_discountId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "discountId",
ADD COLUMN     "discount" INTEGER NOT NULL;
