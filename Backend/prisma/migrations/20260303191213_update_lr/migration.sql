-- AlterTable
ALTER TABLE `entrance_exam_listening` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `entrance_exam_reading` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `part_five` ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `part_four` ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `part_one` ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `part_seven` ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `part_six` ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `part_three` ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `part_two` ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0;
