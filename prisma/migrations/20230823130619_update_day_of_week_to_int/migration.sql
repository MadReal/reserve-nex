/*
  Warnings:

  - The `dayOfWeek` column on the `Block` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Block" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Block_dayOfWeek_key" ON "Block"("dayOfWeek");
