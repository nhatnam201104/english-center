/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `admission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `admission` ADD COLUMN `accessToken` VARCHAR(191) NULL,
    ADD COLUMN `cccd` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `expiresAt` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX `admission_accessToken_key` ON `admission`(`accessToken`);

-- CreateIndex
CREATE INDEX `admission_cccd_idx` ON `admission`(`cccd`);
