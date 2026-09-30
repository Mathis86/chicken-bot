-- CreateTable
CREATE TABLE `UserQuests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userDiscordId` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `questId` INTEGER NOT NULL,
    `progression` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserQuests` ADD CONSTRAINT `UserQuests_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `Quests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
