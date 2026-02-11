/*
  Warnings:

  - The values [COMPLETED] on the enum `Course_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `course` MODIFY `status` ENUM('PLANNING', 'ACTIVE', 'INACTIVE') NOT NULL;
