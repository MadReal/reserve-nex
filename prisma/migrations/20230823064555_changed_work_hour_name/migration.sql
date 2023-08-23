/*
  Warnings:

  - You are about to drop the `WorkHour` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "WorkHour";

-- CreateTable
CREATE TABLE "WorkTime" (
    "id" SERIAL NOT NULL,
    "mealType" "MealType" NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "WorkTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkTime_time_key" ON "WorkTime"("time");
