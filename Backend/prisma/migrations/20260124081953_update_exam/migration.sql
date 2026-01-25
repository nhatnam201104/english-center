/*
  Warnings:

  - You are about to drop the column `entranceExamListeningId` on the `entranceexamlisteninganswer` table. All the data in the column will be lost.
  - You are about to drop the column `entranceExamId` on the `entranceexamlisteningquestion` table. All the data in the column will be lost.
  - You are about to drop the column `entranceExamReadingId` on the `entranceexamreadinganswer` table. All the data in the column will be lost.
  - You are about to drop the column `entranceExamId` on the `entranceexamreadingquestion` table. All the data in the column will be lost.
  - You are about to drop the column `entranceExamId` on the `entranceexamspeakingquestion` table. All the data in the column will be lost.
  - You are about to drop the column `entranceExamId` on the `entranceexamwritingquestion` table. All the data in the column will be lost.
  - Added the required column `listeningExamId` to the `EntranceExam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readingExamId` to the `EntranceExam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speakingExamId` to the `EntranceExam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `writingExamId` to the `EntranceExam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `EntranceExamListeningAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listeningExamId` to the `EntranceExamListeningQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `EntranceExamReadingAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readingExamId` to the `EntranceExamReadingQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speakingExamId` to the `EntranceExamSpeakingQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `writingExamId` to the `EntranceExamWritingQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `entranceexamlisteninganswer` DROP FOREIGN KEY `EntranceExamListeningAnswer_entranceExamListeningId_fkey`;

-- DropForeignKey
ALTER TABLE `entranceexamlisteningquestion` DROP FOREIGN KEY `EntranceExamListeningQuestion_entranceExamId_fkey`;

-- DropForeignKey
ALTER TABLE `entranceexamreadinganswer` DROP FOREIGN KEY `EntranceExamReadingAnswer_entranceExamReadingId_fkey`;

-- DropForeignKey
ALTER TABLE `entranceexamreadingquestion` DROP FOREIGN KEY `EntranceExamReadingQuestion_entranceExamId_fkey`;

-- DropForeignKey
ALTER TABLE `entranceexamspeakingquestion` DROP FOREIGN KEY `EntranceExamSpeakingQuestion_entranceExamId_fkey`;

-- DropForeignKey
ALTER TABLE `entranceexamwritingquestion` DROP FOREIGN KEY `EntranceExamWritingQuestion_entranceExamId_fkey`;

-- DropIndex
DROP INDEX `EntranceExamListeningAnswer_entranceExamListeningId_idx` ON `entranceexamlisteninganswer`;

-- DropIndex
DROP INDEX `EntranceExamListeningQuestion_entranceExamId_idx` ON `entranceexamlisteningquestion`;

-- DropIndex
DROP INDEX `EntranceExamReadingAnswer_entranceExamReadingId_idx` ON `entranceexamreadinganswer`;

-- DropIndex
DROP INDEX `EntranceExamReadingQuestion_entranceExamId_idx` ON `entranceexamreadingquestion`;

-- DropIndex
DROP INDEX `EntranceExamSpeakingQuestion_entranceExamId_idx` ON `entranceexamspeakingquestion`;

-- DropIndex
DROP INDEX `EntranceExamWritingQuestion_entranceExamId_idx` ON `entranceexamwritingquestion`;

-- AlterTable
ALTER TABLE `entranceexam` ADD COLUMN `listeningExamId` INTEGER NOT NULL,
    ADD COLUMN `readingExamId` INTEGER NOT NULL,
    ADD COLUMN `speakingExamId` INTEGER NOT NULL,
    ADD COLUMN `writingExamId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `entranceexamlisteninganswer` DROP COLUMN `entranceExamListeningId`,
    ADD COLUMN `questionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `entranceexamlisteningquestion` DROP COLUMN `entranceExamId`,
    ADD COLUMN `listeningExamId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `entranceexamreadinganswer` DROP COLUMN `entranceExamReadingId`,
    ADD COLUMN `questionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `entranceexamreadingquestion` DROP COLUMN `entranceExamId`,
    ADD COLUMN `readingExamId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `entranceexamspeakingquestion` DROP COLUMN `entranceExamId`,
    ADD COLUMN `speakingExamId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `entranceexamwritingquestion` DROP COLUMN `entranceExamId`,
    ADD COLUMN `writingExamId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `EntranceExamListening` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EntranceExamListening_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExamReading` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EntranceExamReading_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExamSpeaking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EntranceExamSpeaking_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExamWriting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EntranceExamWriting_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `EntranceExamListeningAnswer_questionId_idx` ON `EntranceExamListeningAnswer`(`questionId`);

-- CreateIndex
CREATE INDEX `EntranceExamListeningQuestion_listeningExamId_idx` ON `EntranceExamListeningQuestion`(`listeningExamId`);

-- CreateIndex
CREATE INDEX `EntranceExamReadingAnswer_questionId_idx` ON `EntranceExamReadingAnswer`(`questionId`);

-- CreateIndex
CREATE INDEX `EntranceExamReadingQuestion_readingExamId_idx` ON `EntranceExamReadingQuestion`(`readingExamId`);

-- CreateIndex
CREATE INDEX `EntranceExamSpeakingQuestion_speakingExamId_idx` ON `EntranceExamSpeakingQuestion`(`speakingExamId`);

-- CreateIndex
CREATE INDEX `EntranceExamWritingQuestion_writingExamId_idx` ON `EntranceExamWritingQuestion`(`writingExamId`);

-- AddForeignKey
ALTER TABLE `EntranceExam` ADD CONSTRAINT `EntranceExam_listeningExamId_fkey` FOREIGN KEY (`listeningExamId`) REFERENCES `EntranceExamListening`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExam` ADD CONSTRAINT `EntranceExam_readingExamId_fkey` FOREIGN KEY (`readingExamId`) REFERENCES `EntranceExamReading`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExam` ADD CONSTRAINT `EntranceExam_speakingExamId_fkey` FOREIGN KEY (`speakingExamId`) REFERENCES `EntranceExamSpeaking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExam` ADD CONSTRAINT `EntranceExam_writingExamId_fkey` FOREIGN KEY (`writingExamId`) REFERENCES `EntranceExamWriting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamListeningQuestion` ADD CONSTRAINT `EntranceExamListeningQuestion_listeningExamId_fkey` FOREIGN KEY (`listeningExamId`) REFERENCES `EntranceExamListening`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamListeningAnswer` ADD CONSTRAINT `EntranceExamListeningAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `EntranceExamListeningQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamReadingQuestion` ADD CONSTRAINT `EntranceExamReadingQuestion_readingExamId_fkey` FOREIGN KEY (`readingExamId`) REFERENCES `EntranceExamReading`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamReadingAnswer` ADD CONSTRAINT `EntranceExamReadingAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `EntranceExamReadingQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamSpeakingQuestion` ADD CONSTRAINT `EntranceExamSpeakingQuestion_speakingExamId_fkey` FOREIGN KEY (`speakingExamId`) REFERENCES `EntranceExamSpeaking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamWritingQuestion` ADD CONSTRAINT `EntranceExamWritingQuestion_writingExamId_fkey` FOREIGN KEY (`writingExamId`) REFERENCES `EntranceExamWriting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
