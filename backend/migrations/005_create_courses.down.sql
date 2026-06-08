-- Migration 005 Down
DROP INDEX IF EXISTS idx_courses_created;
DROP INDEX IF EXISTS idx_courses_price;
DROP INDEX IF EXISTS idx_courses_featured;
DROP INDEX IF EXISTS idx_courses_active;
DROP INDEX IF EXISTS idx_courses_type;
DROP INDEX IF EXISTS idx_courses_sub_category;
DROP INDEX IF EXISTS idx_courses_category;
DROP INDEX IF EXISTS idx_courses_slug;
DROP TABLE IF EXISTS courses;
