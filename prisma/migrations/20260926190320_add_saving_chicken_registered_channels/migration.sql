-- AlterTable
ALTER TABLE `registeredchannels` ADD COLUMN `currentMessageId` VARCHAR(191) NULL,
    ADD COLUMN `currentStartTime` INTEGER NULL;
