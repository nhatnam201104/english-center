-- Add user-based ownership fields for payment analytics
ALTER TABLE `payment_transaction`
  ADD COLUMN `studentUserId` INTEGER NULL AFTER `enrollmentDraftId`,
  ADD COLUMN `payerUserId` INTEGER NULL AFTER `studentUserId`;

-- Backfill student user from admission email
UPDATE `payment_transaction` pt
JOIN `enrollment_draft` ed ON ed.`id` = pt.`enrollmentDraftId`
JOIN `admission` a ON a.`id` = ed.`admissionId`
LEFT JOIN `user` su ON su.`email` = a.`email` AND su.`deletedAt` IS NULL
SET pt.`studentUserId` = su.`id`
WHERE pt.`studentUserId` IS NULL;

-- Backfill payer user from parentData.email when available
UPDATE `payment_transaction` pt
JOIN `enrollment_draft` ed ON ed.`id` = pt.`enrollmentDraftId`
LEFT JOIN `user` pu
  ON pu.`email` = JSON_UNQUOTE(JSON_EXTRACT(ed.`parentData`, '$.email'))
  AND pu.`deletedAt` IS NULL
SET pt.`payerUserId` = pu.`id`
WHERE pt.`payerUserId` IS NULL;

CREATE INDEX `payment_transaction_studentUserId_status_finalizedAt_idx`
  ON `payment_transaction`(`studentUserId`, `status`, `finalizedAt`);

CREATE INDEX `payment_transaction_payerUserId_status_finalizedAt_idx`
  ON `payment_transaction`(`payerUserId`, `status`, `finalizedAt`);

ALTER TABLE `payment_transaction`
  ADD CONSTRAINT `payment_transaction_studentUserId_fkey`
    FOREIGN KEY (`studentUserId`) REFERENCES `user`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_transaction_payerUserId_fkey`
    FOREIGN KEY (`payerUserId`) REFERENCES `user`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
