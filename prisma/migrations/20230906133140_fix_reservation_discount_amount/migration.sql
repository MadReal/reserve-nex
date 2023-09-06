/*
  Warnings:

  - You are about to drop the column `discount` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "discount",
ADD COLUMN     "discountAmount" INTEGER;
