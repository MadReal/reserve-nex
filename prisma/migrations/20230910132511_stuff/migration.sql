/*
  Warnings:

  - Changed the type of `personPhone` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `isLive` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "personPhone",
ADD COLUMN     "personPhone" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "isLive" BOOLEAN NOT NULL;
