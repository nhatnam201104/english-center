-- AlterTable
ALTER TABLE `entrance_exam_speaking` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `entrance_exam_writing` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false;
