/*
  Warnings:

  - A unique constraint covering the columns `[userDiscordId,guildId,questId]` on the table `UserQuests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserQuests_userDiscordId_guildId_questId_key` ON `UserQuests`(`userDiscordId`, `guildId`, `questId`);
