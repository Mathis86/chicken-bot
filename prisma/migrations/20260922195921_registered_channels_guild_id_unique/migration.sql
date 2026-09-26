/*
  Warnings:

  - A unique constraint covering the columns `[guildId]` on the table `RegisteredChannels` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `RegisteredChannels_guildId_channelId_key` ON `registeredchannels`;

-- CreateIndex
CREATE UNIQUE INDEX `RegisteredChannels_guildId_key` ON `RegisteredChannels`(`guildId`);
