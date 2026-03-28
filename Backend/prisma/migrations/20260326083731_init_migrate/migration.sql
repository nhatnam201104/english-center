-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'TEACHER', 'STUDENT', 'PARENT') NOT NULL DEFAULT 'STUDENT',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `isTeaching` BOOLEAN NOT NULL DEFAULT false,
    `degree` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `teacher_info_userId_key`(`userId`),
    INDEX `teacher_info_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_free_day` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NOT NULL,
    `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `teacher_free_day_teacherId_idx`(`teacherId`),
    UNIQUE INDEX `teacher_free_day_teacherId_day_key`(`teacherId`, `day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `dob` DATETIME(3) NULL,
    `cccd` VARCHAR(191) NULL,
    `scoreRl` INTEGER NOT NULL DEFAULT 0,
    `scoreSw` INTEGER NOT NULL DEFAULT 0,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_info_userId_key`(`userId`),
    INDEX `student_info_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parent_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `parent_info_userId_key`(`userId`),
    INDEX `parent_info_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parent_student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parentId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `parent_student_parentId_idx`(`parentId`),
    INDEX `parent_student_studentId_idx`(`studentId`),
    UNIQUE INDEX `parent_student_parentId_studentId_key`(`parentId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_register_course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `student_register_course_studentId_idx`(`studentId`),
    INDEX `student_register_course_courseId_idx`(`courseId`),
    UNIQUE INDEX `student_register_course_studentId_courseId_key`(`studentId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamId` INTEGER NULL,
    `email` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `cccd` VARCHAR(191) NOT NULL DEFAULT '',
    `accessToken` VARCHAR(191) NULL,
    `status` ENUM('REGISTERED', 'PENDING', 'LISTENING', 'LISTENING_DONE', 'READING', 'SPEAKING', 'SPEAKING_DONE', 'WRITING', 'WRITING_DONE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'REGISTERED',
    `entranceScore` INTEGER NOT NULL DEFAULT 0,
    `type` ENUM('READING_LISTENING', 'SPEAKING_WRITING') NOT NULL,
    `scoreListening` INTEGER NOT NULL DEFAULT 0,
    `scoreReading` INTEGER NOT NULL DEFAULT 0,
    `scoreSpeaking` INTEGER NOT NULL DEFAULT 0,
    `scoreWriting` INTEGER NOT NULL DEFAULT 0,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `totalListening` INTEGER NOT NULL DEFAULT 0,
    `totalReading` INTEGER NOT NULL DEFAULT 0,
    `totalSpeaking` INTEGER NOT NULL DEFAULT 0,
    `totalWriting` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admission_accessToken_key`(`accessToken`),
    INDEX `admission_entranceExamId_idx`(`entranceExamId`),
    INDEX `admission_cccd_idx`(`cccd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admissions_listening` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `answerId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `admissions_listening_admissionId_idx`(`admissionId`),
    INDEX `admissions_listening_questionId_idx`(`questionId`),
    INDEX `admissions_listening_answerId_idx`(`answerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admissions_reading` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `answerId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `admissions_reading_admissionId_idx`(`admissionId`),
    INDEX `admissions_reading_questionId_idx`(`questionId`),
    INDEX `admissions_reading_answerId_idx`(`answerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admissions_speaking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `audioRecord` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `admissions_speaking_admissionId_idx`(`admissionId`),
    INDEX `admissions_speaking_questionId_idx`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admissions_writing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `answer` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `admissions_writing_admissionId_idx`(`admissionId`),
    INDEX `admissions_writing_questionId_idx`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entrance_exam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('READING_LISTENING', 'SPEAKING_WRITING') NOT NULL,
    `time` INTEGER NOT NULL,
    `listeningExamId` INTEGER NULL,
    `readingExamId` INTEGER NULL,
    `speakingExamId` INTEGER NULL,
    `writingExamId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entrance_exam_listening` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `direction` TEXT NOT NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `entrance_exam_listening_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_one` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listeningExamId` INTEGER NOT NULL,
    `direction` TEXT NOT NULL,
    `totalQuestion` INTEGER NOT NULL DEFAULT 2,
    `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `part_one_listeningExamId_idx`(`listeningExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_one_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partOneId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `audio` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_one_question_partOneId_idx`(`partOneId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_two` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listeningExamId` INTEGER NOT NULL,
    `direction` TEXT NOT NULL,
    `totalQuestion` INTEGER NOT NULL DEFAULT 2,
    `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `part_two_listeningExamId_idx`(`listeningExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_two_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partTwoId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `audio` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL DEFAULT 'Make your answer on your answer sheet.',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_two_question_partTwoId_idx`(`partTwoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_three` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listeningExamId` INTEGER NOT NULL,
    `direction` TEXT NOT NULL,
    `totalQuestion` INTEGER NOT NULL DEFAULT 6,
    `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `part_three_listeningExamId_idx`(`listeningExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_three_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL,
    `partThreeId` INTEGER NOT NULL,
    `audio` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `fromQuestionIndex` INTEGER NOT NULL,
    `toQuestionIndex` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_three_group_partThreeId_idx`(`partThreeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_three_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partThreeGroupId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answerA` VARCHAR(191) NOT NULL,
    `answerB` VARCHAR(191) NOT NULL,
    `answerC` VARCHAR(191) NOT NULL,
    `answerD` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_three_question_partThreeGroupId_idx`(`partThreeGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_four` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listeningExamId` INTEGER NOT NULL,
    `direction` TEXT NOT NULL,
    `totalQuestion` INTEGER NOT NULL DEFAULT 6,
    `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `part_four_listeningExamId_idx`(`listeningExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_four_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL,
    `partFourId` INTEGER NOT NULL,
    `audio` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `fromQuestionIndex` INTEGER NOT NULL,
    `toQuestionIndex` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_four_group_partFourId_idx`(`partFourId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_four_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partFourGroupId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answerA` VARCHAR(191) NOT NULL,
    `answerB` VARCHAR(191) NOT NULL,
    `answerC` VARCHAR(191) NOT NULL,
    `answerD` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_four_question_partFourGroupId_idx`(`partFourGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entrance_exam_reading` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `direction` TEXT NOT NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `entrance_exam_reading_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_five` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `readingExamId` INTEGER NOT NULL,
    `direction` TEXT NOT NULL,
    `totalQuestion` INTEGER NOT NULL DEFAULT 2,
    `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `part_five_readingExamId_idx`(`readingExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_five_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partFiveId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answerA` VARCHAR(191) NOT NULL,
    `answerB` VARCHAR(191) NOT NULL,
    `answerC` VARCHAR(191) NOT NULL,
    `answerD` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_five_question_partFiveId_idx`(`partFiveId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_six` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `readingExamId` INTEGER NOT NULL,
    `direction` TEXT NOT NULL,
    `totalQuestion` INTEGER NOT NULL DEFAULT 8,
    `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `part_six_readingExamId_idx`(`readingExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_six_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL,
    `partSixId` INTEGER NOT NULL,
    `question` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `fromQuestionIndex` INTEGER NOT NULL,
    `toQuestionIndex` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_six_group_partSixId_idx`(`partSixId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_six_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partSixGroupId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answerA` VARCHAR(191) NOT NULL,
    `answerB` VARCHAR(191) NOT NULL,
    `answerC` VARCHAR(191) NOT NULL,
    `answerD` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_six_question_partSixGroupId_idx`(`partSixGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_seven` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `readingExamId` INTEGER NOT NULL,
    `direction` TEXT NOT NULL,
    `totalQuestion` INTEGER NOT NULL DEFAULT 4,
    `quantityQuestionDone` INTEGER NOT NULL DEFAULT 0,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `part_seven_readingExamId_idx`(`readingExamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_seven_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL,
    `partSevenId` INTEGER NOT NULL,
    `question` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `fromQuestionIndex` INTEGER NOT NULL,
    `toQuestionIndex` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_seven_group_partSevenId_idx`(`partSevenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_seven_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partSevenGroupId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answerA` VARCHAR(191) NOT NULL,
    `answerB` VARCHAR(191) NOT NULL,
    `answerC` VARCHAR(191) NOT NULL,
    `answerD` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `part_seven_question_partSevenGroupId_idx`(`partSevenGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entrance_exam_listening_true_answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamListeningId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `entrance_exam_listening_true_answer_entranceExamListeningId_idx`(`entranceExamListeningId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entrance_exam_reading_true_answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entranceExamReadingId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `entrance_exam_reading_true_answer_entranceExamReadingId_idx`(`entranceExamReadingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entrance_exam_speaking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `totalQuestion` INTEGER NOT NULL DEFAULT 11,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `entrance_exam_speaking_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `speaking_one_two` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL DEFAULT 1,
    `speakingExamId` INTEGER NOT NULL,
    `questionOne` TEXT NOT NULL,
    `questionTwo` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `speaking_one_two_speakingExamId_idx`(`speakingExamId`),
    UNIQUE INDEX `speaking_one_two_speakingExamId_index_key`(`speakingExamId`, `index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `speaking_three_four` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL DEFAULT 2,
    `speakingExamId` INTEGER NOT NULL,
    `imageThree` VARCHAR(191) NOT NULL,
    `imageFour` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `speaking_three_four_speakingExamId_idx`(`speakingExamId`),
    UNIQUE INDEX `speaking_three_four_speakingExamId_index_key`(`speakingExamId`, `index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `speaking_five_to_seven` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL DEFAULT 3,
    `speakingExamId` INTEGER NOT NULL,
    `passage` VARCHAR(191) NOT NULL,
    `questionFive` TEXT NOT NULL,
    `questionSix` TEXT NOT NULL,
    `questionSeven` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `speaking_five_to_seven_speakingExamId_idx`(`speakingExamId`),
    UNIQUE INDEX `speaking_five_to_seven_speakingExamId_index_key`(`speakingExamId`, `index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `speaking_eight_to_ten` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL DEFAULT 4,
    `speakingExamId` INTEGER NOT NULL,
    `passage` VARCHAR(191) NOT NULL,
    `questionEight` TEXT NOT NULL,
    `questionNine` TEXT NOT NULL,
    `questionTen` TEXT NOT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `speaking_eight_to_ten_speakingExamId_idx`(`speakingExamId`),
    UNIQUE INDEX `speaking_eight_to_ten_speakingExamId_index_key`(`speakingExamId`, `index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `speaking_eleven` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL DEFAULT 5,
    `speakingExamId` INTEGER NOT NULL,
    `question` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `speaking_eleven_speakingExamId_idx`(`speakingExamId`),
    UNIQUE INDEX `speaking_eleven_speakingExamId_index_key`(`speakingExamId`, `index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entrance_exam_writing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `entrance_exam_writing_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `writing_one_to_five` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL DEFAULT 1,
    `writingExamId` INTEGER NOT NULL,
    `imageOne` VARCHAR(191) NOT NULL,
    `imageTwo` VARCHAR(191) NOT NULL,
    `imageThree` VARCHAR(191) NOT NULL,
    `imageFour` VARCHAR(191) NOT NULL,
    `imageFive` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `writing_one_to_five_writingExamId_idx`(`writingExamId`),
    UNIQUE INDEX `writing_one_to_five_writingExamId_index_key`(`writingExamId`, `index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `writing_six_seven` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL DEFAULT 2,
    `writingExamId` INTEGER NOT NULL,
    `imageSix` VARCHAR(191) NOT NULL,
    `imageSeven` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `writing_six_seven_writingExamId_idx`(`writingExamId`),
    UNIQUE INDEX `writing_six_seven_writingExamId_index_key`(`writingExamId`, `index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `writing_eight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL DEFAULT 3,
    `writingExamId` INTEGER NOT NULL,
    `questionEight` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `writing_eight_writingExamId_idx`(`writingExamId`),
    UNIQUE INDEX `writing_eight_writingExamId_index_key`(`writingExamId`, `index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('COURSE', 'TEST_PREPARATION') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `courseSkill` ENUM('READING_LISTENING', 'SPEAKING_WRITING') NOT NULL,
    `status` ENUM('PLANNING', 'ACTIVE', 'INACTIVE') NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `sale` INTEGER NOT NULL DEFAULT 0,
    `thumbnail` VARCHAR(191) NOT NULL,
    `totalSession` INTEGER NOT NULL DEFAULT 0,
    `minBand` INTEGER NULL DEFAULT 0,
    `maxBand` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `fileTest` VARCHAR(191) NOT NULL,
    `audioTest` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `course_test_courseId_idx`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `maxSize` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `classroom_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule` (
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

    INDEX `schedule_teacherId_idx`(`teacherId`),
    INDEX `schedule_classroomId_idx`(`classroomId`),
    INDEX `schedule_coursesId_idx`(`coursesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule_session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `schedule_session_scheduleId_idx`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule_registration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `schedule_registration_scheduleId_idx`(`scheduleId`),
    INDEX `schedule_registration_studentId_idx`(`studentId`),
    UNIQUE INDEX `schedule_registration_scheduleId_studentId_key`(`scheduleId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule_attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleDayId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `qrCode` VARCHAR(191) NOT NULL,
    `totalAbsent` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `schedule_attendance_scheduleDayId_idx`(`scheduleDayId`),
    INDEX `schedule_attendance_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleAttendanceId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `attendance_record_scheduleAttendanceId_idx`(`scheduleAttendanceId`),
    INDEX `attendance_record_studentId_idx`(`studentId`),
    UNIQUE INDEX `attendance_record_scheduleAttendanceId_studentId_key`(`scheduleAttendanceId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `score_course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseTestId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `score_course_courseTestId_idx`(`courseTestId`),
    INDEX `score_course_studentId_idx`(`studentId`),
    UNIQUE INDEX `score_course_courseTestId_studentId_key`(`courseTestId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `studentUserId` INTEGER NULL,
    `payerUserId` INTEGER NULL,
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
    INDEX `payment_transaction_studentUserId_status_finalizedAt_idx`(`studentUserId`, `status`, `finalizedAt`),
    INDEX `payment_transaction_payerUserId_status_finalizedAt_idx`(`payerUserId`, `status`, `finalizedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `teacher_info` ADD CONSTRAINT `teacher_info_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_free_day` ADD CONSTRAINT `teacher_free_day_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher_info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_info` ADD CONSTRAINT `student_info_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parent_info` ADD CONSTRAINT `parent_info_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parent_student` ADD CONSTRAINT `parent_student_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `parent_info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parent_student` ADD CONSTRAINT `parent_student_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student_info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_register_course` ADD CONSTRAINT `student_register_course_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student_info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_register_course` ADD CONSTRAINT `student_register_course_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admission` ADD CONSTRAINT `admission_entranceExamId_fkey` FOREIGN KEY (`entranceExamId`) REFERENCES `entrance_exam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admissions_listening` ADD CONSTRAINT `admissions_listening_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admissions_reading` ADD CONSTRAINT `admissions_reading_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admissions_speaking` ADD CONSTRAINT `admissions_speaking_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admissions_writing` ADD CONSTRAINT `admissions_writing_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `admission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entrance_exam` ADD CONSTRAINT `entrance_exam_listeningExamId_fkey` FOREIGN KEY (`listeningExamId`) REFERENCES `entrance_exam_listening`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entrance_exam` ADD CONSTRAINT `entrance_exam_readingExamId_fkey` FOREIGN KEY (`readingExamId`) REFERENCES `entrance_exam_reading`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entrance_exam` ADD CONSTRAINT `entrance_exam_speakingExamId_fkey` FOREIGN KEY (`speakingExamId`) REFERENCES `entrance_exam_speaking`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entrance_exam` ADD CONSTRAINT `entrance_exam_writingExamId_fkey` FOREIGN KEY (`writingExamId`) REFERENCES `entrance_exam_writing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_one` ADD CONSTRAINT `part_one_listeningExamId_fkey` FOREIGN KEY (`listeningExamId`) REFERENCES `entrance_exam_listening`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_one_question` ADD CONSTRAINT `part_one_question_partOneId_fkey` FOREIGN KEY (`partOneId`) REFERENCES `part_one`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_two` ADD CONSTRAINT `part_two_listeningExamId_fkey` FOREIGN KEY (`listeningExamId`) REFERENCES `entrance_exam_listening`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_two_question` ADD CONSTRAINT `part_two_question_partTwoId_fkey` FOREIGN KEY (`partTwoId`) REFERENCES `part_two`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_three` ADD CONSTRAINT `part_three_listeningExamId_fkey` FOREIGN KEY (`listeningExamId`) REFERENCES `entrance_exam_listening`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_three_group` ADD CONSTRAINT `part_three_group_partThreeId_fkey` FOREIGN KEY (`partThreeId`) REFERENCES `part_three`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_three_question` ADD CONSTRAINT `part_three_question_partThreeGroupId_fkey` FOREIGN KEY (`partThreeGroupId`) REFERENCES `part_three_group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_four` ADD CONSTRAINT `part_four_listeningExamId_fkey` FOREIGN KEY (`listeningExamId`) REFERENCES `entrance_exam_listening`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_four_group` ADD CONSTRAINT `part_four_group_partFourId_fkey` FOREIGN KEY (`partFourId`) REFERENCES `part_four`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_four_question` ADD CONSTRAINT `part_four_question_partFourGroupId_fkey` FOREIGN KEY (`partFourGroupId`) REFERENCES `part_four_group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_five` ADD CONSTRAINT `part_five_readingExamId_fkey` FOREIGN KEY (`readingExamId`) REFERENCES `entrance_exam_reading`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_five_question` ADD CONSTRAINT `part_five_question_partFiveId_fkey` FOREIGN KEY (`partFiveId`) REFERENCES `part_five`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_six` ADD CONSTRAINT `part_six_readingExamId_fkey` FOREIGN KEY (`readingExamId`) REFERENCES `entrance_exam_reading`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_six_group` ADD CONSTRAINT `part_six_group_partSixId_fkey` FOREIGN KEY (`partSixId`) REFERENCES `part_six`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_six_question` ADD CONSTRAINT `part_six_question_partSixGroupId_fkey` FOREIGN KEY (`partSixGroupId`) REFERENCES `part_six_group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_seven` ADD CONSTRAINT `part_seven_readingExamId_fkey` FOREIGN KEY (`readingExamId`) REFERENCES `entrance_exam_reading`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_seven_group` ADD CONSTRAINT `part_seven_group_partSevenId_fkey` FOREIGN KEY (`partSevenId`) REFERENCES `part_seven`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_seven_question` ADD CONSTRAINT `part_seven_question_partSevenGroupId_fkey` FOREIGN KEY (`partSevenGroupId`) REFERENCES `part_seven_group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entrance_exam_listening_true_answer` ADD CONSTRAINT `entrance_exam_listening_true_answer_entranceExamListeningId_fkey` FOREIGN KEY (`entranceExamListeningId`) REFERENCES `entrance_exam_listening`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entrance_exam_reading_true_answer` ADD CONSTRAINT `entrance_exam_reading_true_answer_entranceExamReadingId_fkey` FOREIGN KEY (`entranceExamReadingId`) REFERENCES `entrance_exam_reading`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `speaking_one_two` ADD CONSTRAINT `speaking_one_two_speakingExamId_fkey` FOREIGN KEY (`speakingExamId`) REFERENCES `entrance_exam_speaking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `speaking_three_four` ADD CONSTRAINT `speaking_three_four_speakingExamId_fkey` FOREIGN KEY (`speakingExamId`) REFERENCES `entrance_exam_speaking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `speaking_five_to_seven` ADD CONSTRAINT `speaking_five_to_seven_speakingExamId_fkey` FOREIGN KEY (`speakingExamId`) REFERENCES `entrance_exam_speaking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `speaking_eight_to_ten` ADD CONSTRAINT `speaking_eight_to_ten_speakingExamId_fkey` FOREIGN KEY (`speakingExamId`) REFERENCES `entrance_exam_speaking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `speaking_eleven` ADD CONSTRAINT `speaking_eleven_speakingExamId_fkey` FOREIGN KEY (`speakingExamId`) REFERENCES `entrance_exam_speaking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `writing_one_to_five` ADD CONSTRAINT `writing_one_to_five_writingExamId_fkey` FOREIGN KEY (`writingExamId`) REFERENCES `entrance_exam_writing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `writing_six_seven` ADD CONSTRAINT `writing_six_seven_writingExamId_fkey` FOREIGN KEY (`writingExamId`) REFERENCES `entrance_exam_writing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `writing_eight` ADD CONSTRAINT `writing_eight_writingExamId_fkey` FOREIGN KEY (`writingExamId`) REFERENCES `entrance_exam_writing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_test` ADD CONSTRAINT `course_test_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher_info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_classroomId_fkey` FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_coursesId_fkey` FOREIGN KEY (`coursesId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_session` ADD CONSTRAINT `schedule_session_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_registration` ADD CONSTRAINT `schedule_registration_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_registration` ADD CONSTRAINT `schedule_registration_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student_info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_attendance` ADD CONSTRAINT `schedule_attendance_scheduleDayId_fkey` FOREIGN KEY (`scheduleDayId`) REFERENCES `schedule_session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_record` ADD CONSTRAINT `attendance_record_scheduleAttendanceId_fkey` FOREIGN KEY (`scheduleAttendanceId`) REFERENCES `schedule_attendance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_record` ADD CONSTRAINT `attendance_record_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student_info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `score_course` ADD CONSTRAINT `score_course_courseTestId_fkey` FOREIGN KEY (`courseTestId`) REFERENCES `course_test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `score_course` ADD CONSTRAINT `score_course_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student_info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `payment_transaction` ADD CONSTRAINT `payment_transaction_studentUserId_fkey` FOREIGN KEY (`studentUserId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transaction` ADD CONSTRAINT `payment_transaction_payerUserId_fkey` FOREIGN KEY (`payerUserId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
