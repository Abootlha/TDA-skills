-- Migration 001: Drop admins table
-- Down

DROP INDEX IF EXISTS idx_admins_active;
DROP INDEX IF EXISTS idx_admins_role;
DROP INDEX IF EXISTS idx_admins_email;
DROP TABLE IF EXISTS admins;
