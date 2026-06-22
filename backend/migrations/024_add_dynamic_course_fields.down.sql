-- Migration 024: Add dynamic course fields
-- Down

ALTER TABLE courses
DROP COLUMN IF EXISTS badges,
DROP COLUMN IF EXISTS quick_stats,
DROP COLUMN IF EXISTS included,
DROP COLUMN IF EXISTS overview,
DROP COLUMN IF EXISTS syllabus,
DROP COLUMN IF EXISTS related_courses,
DROP COLUMN IF EXISTS deposit,
DROP COLUMN IF EXISTS reviews_count,
DROP COLUMN IF EXISTS rating;
