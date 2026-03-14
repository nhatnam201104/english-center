/*
  Warnings:

  - The values [ALL] on the enum `course_courseSkill` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `course` MODIFY `courseSkill` ENUM('READING_LISTENING', 'SPEAKING_WRITING') NOT NULL;

-- CreateTable
CREATE TABLE `registration_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(36) NOT NULL,
    `admissionId` INTEGER NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `registration_token_token_key`(`token`),
    INDEX `registration_token_admissionId_idx`(`admissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enrollment_draft` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionId` INTEGER NOT NULL,
    `registrationTokenId` INTEGER NOT NULL,
    `candidateData` JSON NOT NULL,
    `parentData` JSON NULL,
    `scheduleId` INTEGER NULL,
    `status` ENUM('DRAFT', 'PENDING_PAYMENT', 'COMPLETED', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'DRAFT',
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `enrollment_draft_admissionId_idx`(`admissionId`),
    INDEX `enrollment_draft_registrationTokenId_idx`(`registrationTokenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seat_reservation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentDraftId` INTEGER NOT NULL,
    `scheduleId` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'EXPIRED', 'CONVERTED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `seat_reservation_enrollmentDraftId_key`(`enrollmentDraftId`),
    INDEX `seat_reservation_scheduleId_status_expiresAt_idx`(`scheduleId`, `status`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentDraftId` INTEGER NOT NULL,
    `txnRef` VARCHAR(100) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `vnpTransactionNo` VARCHAR(191) NULL,
    `vnpBankCode` VARCHAR(191) NULL,
    `vnpPayDate` VARCHAR(191) NULL,
    `vnpResponseCode` VARCHAR(191) NULL,
    `vnpCreateDate` VARCHAR(14) NOT NULL,
    `ipnReceivedAt` DATETIME(3) NULL,
    `finalizedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_transaction_enrollmentDraftId_key`(`enrollmentDraftId`),
    UNIQUE INDEX `payment_transaction_txnRef_key`(`txnRef`),
    INDEX `payment_transaction_enrollmentDraftId_idx`(`enrollmentDraftId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `registration_token` ADD CONSTRAINT `registration_token_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment_draft` ADD CONSTRAINT `enrollment_draft_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment_draft` ADD CONSTRAINT `enrollment_draft_registrationTokenId_fkey` FOREIGN KEY (`registrationTokenId`) REFERENCES `registration_token`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seat_reservation` ADD CONSTRAINT `seat_reservation_enrollmentDraftId_fkey` FOREIGN KEY (`enrollmentDraftId`) REFERENCES `enrollment_draft`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seat_reservation` ADD CONSTRAINT `seat_reservation_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transaction` ADD CONSTRAINT `payment_transaction_enrollmentDraftId_fkey` FOREIGN KEY (`enrollmentDraftId`) REFERENCES `enrollment_draft`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
