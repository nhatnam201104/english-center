/*
  Warnings:

  - Added the required column `updatedAt` to the `EntranceExamListening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EntranceExamReading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EntranceExamSpeaking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EntranceExamWriting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coursetest` ADD COLUMN `audioTest` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `entranceexamlistening` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `entranceexamreading` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `entranceexamspeaking` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `entranceexamwriting` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
