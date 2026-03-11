/*
  Warnings:

  - You are about to alter the column `status` on the `admission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `admission` MODIFY `status` ENUM('REGISTERED', 'PENDING', 'LISTENING', 'LISTENING_DONE', 'READING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'REGISTERED';
