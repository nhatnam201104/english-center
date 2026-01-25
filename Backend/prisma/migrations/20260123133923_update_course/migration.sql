/*
  Warnings:

  - You are about to alter the column `type` on the `course` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - Added the required column `status` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `status` ENUM('PLANNING', 'ACTIVE', 'INACTIVE', 'COMPLETED') NOT NULL,
    MODIFY `type` ENUM('COURSE', 'TEST_PREPARATION') NOT NULL;
