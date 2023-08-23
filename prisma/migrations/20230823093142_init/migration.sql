-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('LUNCH', 'DINNER');

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkTime" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,
    "mealType" "MealType" NOT NULL,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "WorkTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" TEXT,
    "timeFrom" TEXT,
    "timeTo" TEXT,
    "date" TIMESTAMP(3),
    "dateFrom" TIMESTAMP(3),
    "dateTo" TIMESTAMP(3),
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "personName" TEXT NOT NULL,
    "personPhone" TEXT NOT NULL,
    "personEmail" TEXT NOT NULL,
    "peopleAmount" INTEGER NOT NULL,
    "accepted" BOOLEAN,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_name_key" ON "Restaurant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkTime_time_key" ON "WorkTime"("time");

-- CreateIndex
CREATE UNIQUE INDEX "Block_dayOfWeek_key" ON "Block"("dayOfWeek");

-- AddForeignKey
ALTER TABLE "WorkTime" ADD CONSTRAINT "WorkTime_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
