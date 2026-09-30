/*
  Warnings:

  - You are about to drop the column `description` on the `quests` table. All the data in the column will be lost.
  - Added the required column `descriptionEn` to the `Quests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionFr` to the `Quests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `quests` DROP COLUMN `description`,
    ADD COLUMN `descriptionEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `descriptionFr` VARCHAR(191) NOT NULL;
