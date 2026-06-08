-- Migration 011 Down
DROP INDEX IF EXISTS idx_audit_created;
DROP INDEX IF EXISTS idx_audit_entity;
DROP INDEX IF EXISTS idx_audit_admin;
DROP TABLE IF EXISTS admin_audit_logs;
