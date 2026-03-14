-- CreateTable
CREATE TABLE `grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `participationScore` DOUBLE NULL DEFAULT 0,
    `examScore` DOUBLE NULL DEFAULT 0,
    `finalScore` DOUBLE NULL DEFAULT 0,
    `status` ENUM('NOT_GRADED', 'PASS', 'FAIL') NOT NULL DEFAULT 'NOT_GRADED',
    `gradedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `grade_studentId_idx`(`studentId`),
    INDEX `grade_courseId_idx`(`courseId`),
    UNIQUE INDEX `grade_studentId_courseId_key`(`studentId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `grade` ADD CONSTRAINT `grade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student_info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grade` ADD CONSTRAINT `grade_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
