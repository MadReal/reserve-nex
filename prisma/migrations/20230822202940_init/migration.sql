-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('LUNCH', 'DINNER');

-- CreateTable
CREATE TABLE "WorkHour" (
    "id" SERIAL NOT NULL,
    "mealType" "MealType" NOT NULL,
    "timeSlot" TEXT NOT NULL,

    CONSTRAINT "WorkHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedDayEveryWeek" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" TEXT NOT NULL,

    CONSTRAINT "BlockedDayEveryWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedDaysPeriod" (
    "id" SERIAL NOT NULL,
    "dateFrom" TIMESTAMP(3) NOT NULL,
    "dateTo" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockedDaysPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedWorkHourOnDate" (
    "id" SERIAL NOT NULL,
    "hourFrom" TEXT NOT NULL,
    "hourTo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockedWorkHourOnDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkHour_timeSlot_key" ON "WorkHour"("timeSlot");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedDayEveryWeek_dayOfWeek_key" ON "BlockedDayEveryWeek"("dayOfWeek");
