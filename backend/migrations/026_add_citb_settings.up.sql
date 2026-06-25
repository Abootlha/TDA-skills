INSERT INTO admin_settings (id, key, value, description, is_public, updated_at) VALUES 
(gen_random_uuid(), 'citb_test_price', '22.50', 'Base price for CITB Health, Safety & Environment Test', true, NOW()),
(gen_random_uuid(), 'citb_booking_fee', '12.50', 'Booking fee for CITB tests', true, NOW())
ON CONFLICT (key) DO NOTHING;
