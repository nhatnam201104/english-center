-- ============================================================
-- Migration: update_question_count_to_testing
-- Changes totalQuestion from standard TOEIC counts to 2 per part
-- (Testing mode: 2 questions per part → 8 Listening + 6 Reading = 14 total)
-- To restore full TOEIC: re-run with the original values (6,25,39,30,30,16,54)
-- ============================================================

-- 1. Change column defaults to 2 for all LR parts
ALTER TABLE `part_one`   MODIFY COLUMN `totalQuestion` INTEGER NOT NULL DEFAULT 2;
ALTER TABLE `part_two`   MODIFY COLUMN `totalQuestion` INTEGER NOT NULL DEFAULT 2;
ALTER TABLE `part_three` MODIFY COLUMN `totalQuestion` INTEGER NOT NULL DEFAULT 2;
ALTER TABLE `part_four`  MODIFY COLUMN `totalQuestion` INTEGER NOT NULL DEFAULT 2;
ALTER TABLE `part_five`  MODIFY COLUMN `totalQuestion` INTEGER NOT NULL DEFAULT 2;
ALTER TABLE `part_six`   MODIFY COLUMN `totalQuestion` INTEGER NOT NULL DEFAULT 2;
ALTER TABLE `part_seven` MODIFY COLUMN `totalQuestion` INTEGER NOT NULL DEFAULT 2;

-- 2. Update existing rows: set totalQuestion = 2 for all parts
UPDATE `part_one`   SET `totalQuestion` = 2;
UPDATE `part_two`   SET `totalQuestion` = 2;
UPDATE `part_three` SET `totalQuestion` = 2;
UPDATE `part_four`  SET `totalQuestion` = 2;
UPDATE `part_five`  SET `totalQuestion` = 2;
UPDATE `part_six`   SET `totalQuestion` = 2;
UPDATE `part_seven` SET `totalQuestion` = 2;

-- 3. Mark parts as done where quantityQuestionDone >= 2
UPDATE `part_one`   SET `isDone` = 1 WHERE `quantityQuestionDone` >= 2;
UPDATE `part_two`   SET `isDone` = 1 WHERE `quantityQuestionDone` >= 2;
UPDATE `part_three` SET `isDone` = 1 WHERE `quantityQuestionDone` >= 2;
UPDATE `part_four`  SET `isDone` = 1 WHERE `quantityQuestionDone` >= 2;
UPDATE `part_five`  SET `isDone` = 1 WHERE `quantityQuestionDone` >= 2;
UPDATE `part_six`   SET `isDone` = 1 WHERE `quantityQuestionDone` >= 2;
UPDATE `part_seven` SET `isDone` = 1 WHERE `quantityQuestionDone` >= 2;

-- 4. Update entrance_exam_listening.isDone = true when all 4 parts are done
UPDATE `entrance_exam_listening` eel
SET eel.`isDone` = 1
WHERE (
  SELECT COUNT(*) FROM `part_one`   p1 WHERE p1.`listeningExamId` = eel.`id` AND p1.`isDone` = 1
) > 0
AND (
  SELECT COUNT(*) FROM `part_two`   p2 WHERE p2.`listeningExamId` = eel.`id` AND p2.`isDone` = 1
) > 0
AND (
  SELECT COUNT(*) FROM `part_three` p3 WHERE p3.`listeningExamId` = eel.`id` AND p3.`isDone` = 1
) > 0
AND (
  SELECT COUNT(*) FROM `part_four`  p4 WHERE p4.`listeningExamId` = eel.`id` AND p4.`isDone` = 1
) > 0;

-- 5. Update entrance_exam_reading.isDone = true when all 3 parts are done
UPDATE `entrance_exam_reading` eer
SET eer.`isDone` = 1
WHERE (
  SELECT COUNT(*) FROM `part_five`  p5 WHERE p5.`readingExamId` = eer.`id` AND p5.`isDone` = 1
) > 0
AND (
  SELECT COUNT(*) FROM `part_six`   p6 WHERE p6.`readingExamId` = eer.`id` AND p6.`isDone` = 1
) > 0
AND (
  SELECT COUNT(*) FROM `part_seven` p7 WHERE p7.`readingExamId` = eer.`id` AND p7.`isDone` = 1
) > 0;
