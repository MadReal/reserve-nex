/*
  Warnings:

  - You are about to drop the column `amount` on the `DiscountAmount` table. All the data in the column will be lost.
  - Added the required column `value` to the `DiscountAmount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscountAmount" DROP COLUMN "amount",
ADD COLUMN     "value" INTEGER NOT NULL;
