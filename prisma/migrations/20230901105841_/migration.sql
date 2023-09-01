/*
  Warnings:

  - Made the column `address` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipCode` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "personInstagram" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "zipCode" SET NOT NULL;
