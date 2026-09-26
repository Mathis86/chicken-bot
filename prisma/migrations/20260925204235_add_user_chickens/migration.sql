-- CreateTable
CREATE TABLE `UserChickens` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userDiscordId` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `chickenId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `UserChickens_userDiscordId_guildId_chickenId_key`(`userDiscordId`, `guildId`, `chickenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserChickens` ADD CONSTRAINT `UserChickens_chickenId_fkey` FOREIGN KEY (`chickenId`) REFERENCES `Chickens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
