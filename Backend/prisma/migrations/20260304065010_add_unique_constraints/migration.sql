-- Add unique constraints to Writing exam parts
ALTER TABLE `writing_one_to_five` ADD UNIQUE INDEX `writing_one_to_five_writingExamId_index_key` (`writingExamId`, `index`);
ALTER TABLE `writing_six_seven` ADD UNIQUE INDEX `writing_six_seven_writingExamId_index_key` (`writingExamId`, `index`);
ALTER TABLE `writing_eight` ADD UNIQUE INDEX `writing_eight_writingExamId_index_key` (`writingExamId`, `index`);

-- Add unique constraints to Speaking exam parts
ALTER TABLE `speaking_one_two` ADD UNIQUE INDEX `speaking_one_two_speakingExamId_index_key` (`speakingExamId`, `index`);
ALTER TABLE `speaking_three_four` ADD UNIQUE INDEX `speaking_three_four_speakingExamId_index_key` (`speakingExamId`, `index`);
ALTER TABLE `speaking_five_to_seven` ADD UNIQUE INDEX `speaking_five_to_seven_speakingExamId_index_key` (`speakingExamId`, `index`);
ALTER TABLE `speaking_eight_to_ten` ADD UNIQUE INDEX `speaking_eight_to_ten_speakingExamId_index_key` (`speakingExamId`, `index`);
ALTER TABLE `speaking_eleven` ADD UNIQUE INDEX `speaking_eleven_speakingExamId_index_key` (`speakingExamId`, `index`);