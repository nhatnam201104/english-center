-- DropForeignKey
ALTER TABLE `entranceexam` DROP FOREIGN KEY `EntranceExam_listeningExamId_fkey`;

-- DropForeignKey
ALTER TABLE `entranceexam` DROP FOREIGN KEY `EntranceExam_readingExamId_fkey`;

-- DropForeignKey
ALTER TABLE `entranceexam` DROP FOREIGN KEY `EntranceExam_speakingExamId_fkey`;

-- DropForeignKey
ALTER TABLE `entranceexam` DROP FOREIGN KEY `EntranceExam_writingExamId_fkey`;

-- DropIndex
DROP INDEX `EntranceExam_listeningExamId_fkey` ON `entranceexam`;

-- DropIndex
DROP INDEX `EntranceExam_readingExamId_fkey` ON `entranceexam`;

-- DropIndex
DROP INDEX `EntranceExam_speakingExamId_fkey` ON `entranceexam`;

-- DropIndex
DROP INDEX `EntranceExam_writingExamId_fkey` ON `entranceexam`;

-- AlterTable
ALTER TABLE `admission` MODIFY `type` ENUM('READING', 'LISTENING', 'SPEAKING', 'WRITING', 'READING_LISTENING', 'SPEAKING_WRITING', 'ALL') NOT NULL;

-- AlterTable
ALTER TABLE `entranceexam` MODIFY `type` ENUM('READING', 'LISTENING', 'SPEAKING', 'WRITING', 'READING_LISTENING', 'SPEAKING_WRITING', 'ALL') NOT NULL,
    MODIFY `listeningExamId` INTEGER NULL,
    MODIFY `readingExamId` INTEGER NULL,
    MODIFY `speakingExamId` INTEGER NULL,
    MODIFY `writingExamId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `EntranceExam` ADD CONSTRAINT `EntranceExam_listeningExamId_fkey` FOREIGN KEY (`listeningExamId`) REFERENCES `EntranceExamListening`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExam` ADD CONSTRAINT `EntranceExam_readingExamId_fkey` FOREIGN KEY (`readingExamId`) REFERENCES `EntranceExamReading`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExam` ADD CONSTRAINT `EntranceExam_speakingExamId_fkey` FOREIGN KEY (`speakingExamId`) REFERENCES `EntranceExamSpeaking`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExam` ADD CONSTRAINT `EntranceExam_writingExamId_fkey` FOREIGN KEY (`writingExamId`) REFERENCES `EntranceExamWriting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
