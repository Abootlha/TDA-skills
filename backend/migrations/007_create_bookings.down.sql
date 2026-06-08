-- Migration 007 Down
DROP INDEX IF EXISTS idx_booking_items_course;
DROP INDEX IF EXISTS idx_booking_items_booking;
DROP TABLE IF EXISTS booking_items;
DROP INDEX IF EXISTS idx_bookings_created;
DROP INDEX IF EXISTS idx_bookings_type;
DROP INDEX IF EXISTS idx_bookings_status;
DROP INDEX IF EXISTS idx_bookings_number;
DROP INDEX IF EXISTS idx_bookings_user;
DROP TABLE IF EXISTS bookings;
