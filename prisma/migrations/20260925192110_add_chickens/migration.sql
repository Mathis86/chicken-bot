-- CreateTable
CREATE TABLE `Chickens` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `imageName` VARCHAR(191) NOT NULL,
    `emojiId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Chickens_name_key`(`name`),
    UNIQUE INDEX `Chickens_imageName_key`(`imageName`),
    UNIQUE INDEX `Chickens_emojiId_key`(`emojiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
