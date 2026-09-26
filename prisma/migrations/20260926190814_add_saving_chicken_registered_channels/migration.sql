/*
  Warnings:

  - You are about to drop the column `currentChickenId` on the `registeredchannels` table. All the data in the column will be lost.
  - You are about to drop the column `currentMessageId` on the `registeredchannels` table. All the data in the column will be lost.
  - You are about to drop the column `currentStartTime` on the `registeredchannels` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `registeredchannels` DROP FOREIGN KEY `RegisteredChannels_currentChickenId_fkey`;

-- DropIndex
DROP INDEX `RegisteredChannels_currentChickenId_fkey` ON `registeredchannels`;

-- AlterTable
ALTER TABLE `registeredchannels` DROP COLUMN `currentChickenId`,
    DROP COLUMN `currentMessageId`,
    DROP COLUMN `currentStartTime`,
    ADD COLUMN `savedChickenId` INTEGER NULL,
    ADD COLUMN `savedMessageId` VARCHAR(191) NULL,
    ADD COLUMN `savedStartTime` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `RegisteredChannels` ADD CONSTRAINT `RegisteredChannels_savedChickenId_fkey` FOREIGN KEY (`savedChickenId`) REFERENCES `Chickens`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
