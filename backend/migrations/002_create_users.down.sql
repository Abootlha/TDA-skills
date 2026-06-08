-- Migration 002: Drop users table
-- Down
DROP INDEX IF EXISTS idx_users_active;
DROP INDEX IF EXISTS idx_users_email;
DROP TABLE IF EXISTS users;
