-- Migration 010 Down
DROP TABLE IF EXISTS admin_settings;
DROP INDEX IF EXISTS idx_favorites_course;
DROP INDEX IF EXISTS idx_favorites_user;
DROP TABLE IF EXISTS user_favorites;
DROP INDEX IF EXISTS idx_reviews_approved;
DROP INDEX IF EXISTS idx_reviews_course;
DROP TABLE IF EXISTS course_reviews;
