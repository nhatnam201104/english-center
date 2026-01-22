-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'TEACHER', 'STUDENT', 'PARENT') NOT NULL DEFAULT 'STUDENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `isTeaching` BOOLEAN NOT NULL DEFAULT false,
    `degree` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TeacherInfo_userId_key`(`userId`),
    INDEX `TeacherInfo_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherFreeDay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NOT NULL,
    `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TeacherFreeDay_teacherId_idx`(`teacherId`),
    UNIQUE INDEX `TeacherFreeDay_teacherId_day_key`(`teacherId`, `day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `dob` DATETIME(3) NULL,
    `cccd` VARCHAR(191) NULL,
    `scoreRl` INTEGER NOT NULL DEFAULT 0,
    `scoreSw` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentInfo_userId_key`(`userId`),
    INDEX `StudentInfo_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParentInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ParentInfo_userId_key`(`userId`),
    INDEX `ParentInfo_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParentStudent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parentId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ParentStudent_parentId_idx`(`parentId`),
    INDEX `ParentStudent_studentId_idx`(`studentId`),
    UNIQUE INDEX `ParentStudent_parentId_studentId_key`(`parentId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentRegisterCourse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudentRegisterCourse_studentId_idx`(`studentId`),
    INDEX `StudentRegisterCourse_courseId_idx`(`courseId`),
    UNIQUE INDEX `StudentRegisterCourse_studentId_courseId_key`(`studentId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamId` INTEGER NULL,
    `email` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `entranceScore` INTEGER NOT NULL DEFAULT 0,
    `type` ENUM('READING_LISTENING', 'SPEAKING_WRITING', 'ALL') NOT NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `totalListening` INTEGER NOT NULL DEFAULT 0,
    `totalReading` INTEGER NOT NULL DEFAULT 0,
    `totalSpeaking` INTEGER NOT NULL DEFAULT 0,
    `totalWriting` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Admission_entranceExamId_idx`(`entranceExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionsListening` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `answerId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdmissionsListening_admissionId_idx`(`admissionId`),
    INDEX `AdmissionsListening_questionId_idx`(`questionId`),
    INDEX `AdmissionsListening_answerId_idx`(`answerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionsReading` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `answerId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdmissionsReading_admissionId_idx`(`admissionId`),
    INDEX `AdmissionsReading_questionId_idx`(`questionId`),
    INDEX `AdmissionsReading_answerId_idx`(`answerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionsSpeaking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `audioRecord` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdmissionsSpeaking_admissionId_idx`(`admissionId`),
    INDEX `AdmissionsSpeaking_questionId_idx`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionsWriting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `answer` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdmissionsWriting_admissionId_idx`(`admissionId`),
    INDEX `AdmissionsWriting_questionId_idx`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('READING_LISTENING', 'SPEAKING_WRITING', 'ALL') NOT NULL,
    `audio` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExamListeningQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `part` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EntranceExamListeningQuestion_entranceExamId_idx`(`entranceExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExamListeningAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamListeningId` INTEGER NOT NULL,
    `part` INTEGER NOT NULL,
    `answer` VARCHAR(191) NULL,
    `isTrue` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EntranceExamListeningAnswer_entranceExamListeningId_idx`(`entranceExamListeningId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExamReadingQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `part` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EntranceExamReadingQuestion_entranceExamId_idx`(`entranceExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExamReadingAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamReadingId` INTEGER NOT NULL,
    `part` INTEGER NOT NULL,
    `answer` VARCHAR(191) NULL,
    `isTrue` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EntranceExamReadingAnswer_entranceExamReadingId_idx`(`entranceExamReadingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExamSpeakingQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `descriptionForAi` VARCHAR(191) NULL,
    `timeToReadInfo` INTEGER NOT NULL,
    `preparationTime` INTEGER NOT NULL,
    `presentationTime` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EntranceExamSpeakingQuestion_entranceExamId_idx`(`entranceExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntranceExamWritingQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `descriptionImageForAi` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EntranceExamWritingQuestion_entranceExamId_idx`(`entranceExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `sale` INTEGER NOT NULL DEFAULT 0,
    `thumbnail` VARCHAR(191) NOT NULL,
    `minBand` INTEGER NULL DEFAULT 0,
    `maxBand` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `fileTest` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CourseTest_courseId_idx`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `maxSize` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Classroom_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NOT NULL,
    `classroomId` INTEGER NOT NULL,
    `coursesId` INTEGER NOT NULL,
    `totalSlot` INTEGER NOT NULL,
    `totalRegister` INTEGER NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Schedule_teacherId_idx`(`teacherId`),
    INDEX `Schedule_classroomId_idx`(`classroomId`),
    INDEX `Schedule_coursesId_idx`(`coursesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduleSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ScheduleSession_scheduleId_idx`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduleRegistration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ScheduleRegistration_scheduleId_idx`(`scheduleId`),
    INDEX `ScheduleRegistration_studentId_idx`(`studentId`),
    UNIQUE INDEX `ScheduleRegistration_scheduleId_studentId_key`(`scheduleId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduleAttendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleDayId` INTEGER NOT NULL,
    `qrCode` VARCHAR(191) NOT NULL,
    `totalAbsent` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ScheduleAttendance_scheduleDayId_idx`(`scheduleDayId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttendanceRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleAttendanceId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AttendanceRecord_scheduleAttendanceId_idx`(`scheduleAttendanceId`),
    INDEX `AttendanceRecord_studentId_idx`(`studentId`),
    UNIQUE INDEX `AttendanceRecord_scheduleAttendanceId_studentId_key`(`scheduleAttendanceId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScoreCourse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseTestId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ScoreCourse_courseTestId_idx`(`courseTestId`),
    INDEX `ScoreCourse_studentId_idx`(`studentId`),
    UNIQUE INDEX `ScoreCourse_courseTestId_studentId_key`(`courseTestId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TeacherInfo` ADD CONSTRAINT `TeacherInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherFreeDay` ADD CONSTRAINT `TeacherFreeDay_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `TeacherInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentInfo` ADD CONSTRAINT `StudentInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentInfo` ADD CONSTRAINT `ParentInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentStudent` ADD CONSTRAINT `ParentStudent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ParentInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentStudent` ADD CONSTRAINT `ParentStudent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRegisterCourse` ADD CONSTRAINT `StudentRegisterCourse_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRegisterCourse` ADD CONSTRAINT `StudentRegisterCourse_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_entranceExamId_fkey` FOREIGN KEY (`entranceExamId`) REFERENCES `EntranceExam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsListening` ADD CONSTRAINT `AdmissionsListening_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsListening` ADD CONSTRAINT `AdmissionsListening_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `EntranceExamListeningQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsListening` ADD CONSTRAINT `AdmissionsListening_answerId_fkey` FOREIGN KEY (`answerId`) REFERENCES `EntranceExamListeningAnswer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsReading` ADD CONSTRAINT `AdmissionsReading_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsReading` ADD CONSTRAINT `AdmissionsReading_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `EntranceExamReadingQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsReading` ADD CONSTRAINT `AdmissionsReading_answerId_fkey` FOREIGN KEY (`answerId`) REFERENCES `EntranceExamReadingAnswer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsSpeaking` ADD CONSTRAINT `AdmissionsSpeaking_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsSpeaking` ADD CONSTRAINT `AdmissionsSpeaking_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `EntranceExamSpeakingQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsWriting` ADD CONSTRAINT `AdmissionsWriting_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionsWriting` ADD CONSTRAINT `AdmissionsWriting_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `EntranceExamWritingQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamListeningQuestion` ADD CONSTRAINT `EntranceExamListeningQuestion_entranceExamId_fkey` FOREIGN KEY (`entranceExamId`) REFERENCES `EntranceExam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamListeningAnswer` ADD CONSTRAINT `EntranceExamListeningAnswer_entranceExamListeningId_fkey` FOREIGN KEY (`entranceExamListeningId`) REFERENCES `EntranceExamListeningQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamReadingQuestion` ADD CONSTRAINT `EntranceExamReadingQuestion_entranceExamId_fkey` FOREIGN KEY (`entranceExamId`) REFERENCES `EntranceExam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamReadingAnswer` ADD CONSTRAINT `EntranceExamReadingAnswer_entranceExamReadingId_fkey` FOREIGN KEY (`entranceExamReadingId`) REFERENCES `EntranceExamReadingQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamSpeakingQuestion` ADD CONSTRAINT `EntranceExamSpeakingQuestion_entranceExamId_fkey` FOREIGN KEY (`entranceExamId`) REFERENCES `EntranceExam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntranceExamWritingQuestion` ADD CONSTRAINT `EntranceExamWritingQuestion_entranceExamId_fkey` FOREIGN KEY (`entranceExamId`) REFERENCES `EntranceExam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseTest` ADD CONSTRAINT `CourseTest_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `TeacherInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_classroomId_fkey` FOREIGN KEY (`classroomId`) REFERENCES `Classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_coursesId_fkey` FOREIGN KEY (`coursesId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleSession` ADD CONSTRAINT `ScheduleSession_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleRegistration` ADD CONSTRAINT `ScheduleRegistration_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleRegistration` ADD CONSTRAINT `ScheduleRegistration_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleAttendance` ADD CONSTRAINT `ScheduleAttendance_scheduleDayId_fkey` FOREIGN KEY (`scheduleDayId`) REFERENCES `ScheduleSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceRecord` ADD CONSTRAINT `AttendanceRecord_scheduleAttendanceId_fkey` FOREIGN KEY (`scheduleAttendanceId`) REFERENCES `ScheduleAttendance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceRecord` ADD CONSTRAINT `AttendanceRecord_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScoreCourse` ADD CONSTRAINT `ScoreCourse_courseTestId_fkey` FOREIGN KEY (`courseTestId`) REFERENCES `CourseTest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScoreCourse` ADD CONSTRAINT `ScoreCourse_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
