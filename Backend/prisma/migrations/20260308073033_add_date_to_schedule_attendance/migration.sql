-- AlterTable
ALTER TABLE `schedule_attendance` ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE INDEX `schedule_attendance_date_idx` ON `schedule_attendance`(`date`);
