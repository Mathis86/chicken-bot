-- AddForeignKey
ALTER TABLE `RegisteredChannels` ADD CONSTRAINT `RegisteredChannels_currentChickenId_fkey` FOREIGN KEY (`currentChickenId`) REFERENCES `Chickens`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
