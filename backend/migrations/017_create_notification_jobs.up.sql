-- Add missing columns to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS email_job_id VARCHAR(100);

-- Drop and recreate the type check to include 'security'
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
    CHECK (type IN ('booking', 'payment', 'reminder', 'system', 'promo', 'admin', 'security'));

CREATE INDEX IF NOT EXISTS idx_notifications_email_pending ON notifications(channel, sent_email) WHERE channel = 'email' AND sent_email = FALSE;

-- Notification jobs table (email queue)
CREATE TABLE notification_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
    job_type VARCHAR(20) DEFAULT 'email'
        CHECK (job_type IN ('email', 'sms', 'push')),
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'retrying')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_error TEXT,
    scheduled_for TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notification_jobs_status ON notification_jobs(status, scheduled_for)
    WHERE status IN ('pending', 'retrying');
