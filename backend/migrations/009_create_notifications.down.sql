-- Migration 009 Down
DROP INDEX IF EXISTS idx_notifications_created;
DROP INDEX IF EXISTS idx_notifications_unread;
DROP INDEX IF EXISTS idx_notifications_user;
DROP TABLE IF EXISTS notifications;
