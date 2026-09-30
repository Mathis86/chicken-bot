-- CreateTable
CREATE TABLE `Quests` (
    `id` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `xp` INTEGER NOT NULL,
    `target` INTEGER NOT NULL,
    `frequency` ENUM('DAILY', 'WEEKLY') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
