-- CreateTable
CREATE TABLE `RegisteredChannels` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(191) NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RegisteredChannels_guildId_channelId_key`(`guildId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
