/*
  Warnings:

  - The `savedStartTime` column on the `registeredchannels` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `registeredchannels` DROP COLUMN `savedStartTime`,
    ADD COLUMN `savedStartTime` DATETIME(3) NULL;
