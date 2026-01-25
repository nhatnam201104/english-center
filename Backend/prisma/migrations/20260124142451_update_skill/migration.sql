/*
  Warnings:

  - You are about to drop the column `audio` on the `entranceexam` table. All the data in the column will be lost.
  - The values [READING,LISTENING,SPEAKING,WRITING] on the enum `Course_courseSkill` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `courseSkill` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `courseSkill` ENUM('READING_LISTENING', 'SPEAKING_WRITING', 'ALL') NOT NULL;

-- AlterTable
ALTER TABLE `entranceexam` DROP COLUMN `audio`,
    MODIFY `type` ENUM('READING_LISTENING', 'SPEAKING_WRITING', 'ALL') NOT NULL;
