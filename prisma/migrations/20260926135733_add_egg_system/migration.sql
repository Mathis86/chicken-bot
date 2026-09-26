/*
  Warnings:

  - Added the required column `minutesBetweenEggs` to the `Chickens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextEggAt` to the `UserChickens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chickens` ADD COLUMN `minutesBetweenEggs` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `userchickens` ADD COLUMN `eggAmount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `nextEggAt` DATETIME(3) NOT NULL;
