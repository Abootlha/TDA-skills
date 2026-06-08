DROP TABLE IF EXISTS notification_jobs;
ALTER TABLE notifications DROP COLUMN IF EXISTS priority;
ALTER TABLE notifications DROP COLUMN IF EXISTS email_job_id;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
    CHECK (type IN ('booking', 'payment', 'reminder', 'system', 'promo', 'admin'));
DROP INDEX IF EXISTS idx_notifications_email_pending;
