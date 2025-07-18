-- Seed data for Waste Samaritan platform
-- This script populates the database with initial test data

-- Insert waste categories
INSERT INTO waste_categories (name, description) VALUES
('Wet Waste', 'Organic waste including food scraps, vegetable peels, and biodegradable materials'),
('Dry Waste', 'Non-biodegradable waste including paper, plastic, metal, and glass'),
('Recyclable', 'Materials that can be processed and reused including bottles, cans, and newspapers'),
('Rejected Waste', 'Hazardous or non-recyclable waste that requires special disposal'),
('Not Segregated', 'Mixed waste that has not been properly separated');

-- Insert sample admin user
INSERT INTO users (email, name, phone, role) VALUES
('admin@wastesamaritan.com', 'System Administrator', '+91-9876543210', 'admin');

-- Insert sample collectors
INSERT INTO users (email, name, phone, role) VALUES
('raj.kumar@collector.com', 'Raj Kumar', '+91-9876543211', 'collector'),
('sunita.devi@collector.com', 'Sunita Devi', '+91-9876543212', 'collector'),
('amit.patel@collector.com', 'Amit Patel', '+91-9876543213', 'collector');

-- Insert sample citizens
INSERT INTO users (email, name, phone, role) VALUES
('rajesh.kumar@citizen.com', 'Rajesh Kumar', '+91-9876543214', 'citizen'),
('priya.sharma@citizen.com', 'Priya Sharma', '+91-9876543215', 'citizen'),
('vikram.singh@citizen.com', 'Vikram Singh', '+91-9876543216', 'citizen'),
('anita.gupta@citizen.com', 'Anita Gupta', '+91-9876543217', 'citizen'),
('rohit.verma@citizen.com', 'Rohit Verma', '+91-9876543218', 'citizen');

-- Insert citizen profiles with addresses
INSERT INTO citizen_profiles (user_id, address_line1, address_line2, city, state, pin_code, landmark)
SELECT 
    u.id,
    CASE 
        WHEN u.name = 'Rajesh Kumar' THEN '123 Green Street'
        WHEN u.name = 'Priya Sharma' THEN '456 Eco Lane'
        WHEN u.name = 'Vikram Singh' THEN '789 Clean Road'
        WHEN u.name = 'Anita Gupta' THEN '321 Fresh Avenue'
        WHEN u.name = 'Rohit Verma' THEN '654 Pure Street'
    END,
    CASE 
        WHEN u.name = 'Rajesh Kumar' THEN 'Sector 15'
        WHEN u.name = 'Priya Sharma' THEN 'Block A'
        WHEN u.name = 'Vikram Singh' THEN 'Phase 2'
        WHEN u.name = 'Anita Gupta' THEN 'Colony B'
        WHEN u.name = 'Rohit Verma' THEN 'Sector 8'
    END,
    'New Delhi',
    'Delhi',
    CASE 
        WHEN u.name = 'Rajesh Kumar' THEN '110015'
        WHEN u.name = 'Priya Sharma' THEN '110016'
        WHEN u.name = 'Vikram Singh' THEN '110017'
        WHEN u.name = 'Anita Gupta' THEN '110018'
        WHEN u.name = 'Rohit Verma' THEN '110019'
    END,
    CASE 
        WHEN u.name = 'Rajesh Kumar' THEN 'Near Metro Station'
        WHEN u.name = 'Priya Sharma' THEN 'Opposite Park'
        WHEN u.name = 'Vikram Singh' THEN 'Near School'
        WHEN u.name = 'Anita Gupta' THEN 'Behind Mall'
        WHEN u.name = 'Rohit Verma' THEN 'Near Hospital'
    END
FROM users u
WHERE u.role = 'citizen';

-- Create collection routes
INSERT INTO collection_routes (collector_id, route_name, area)
SELECT 
    u.id,
    CASE 
        WHEN u.name = 'Raj Kumar' THEN 'Route A - Sector 15-16'
        WHEN u.name = 'Sunita Devi' THEN 'Route B - Phase 1-2'
        WHEN u.name = 'Amit Patel' THEN 'Route C - Sector 8-9'
    END,
    CASE 
        WHEN u.name = 'Raj Kumar' THEN 'Sector 15, Sector 16'
        WHEN u.name = 'Sunita Devi' THEN 'Phase 1, Phase 2'
        WHEN u.name = 'Amit Patel' THEN 'Sector 8, Sector 9'
    END
FROM users u
WHERE u.role = 'collector';

-- Assign houses to routes
INSERT INTO route_houses (route_id, citizen_id, sequence_order)
SELECT 
    cr.id,
    c.id,
    ROW_NUMBER() OVER (PARTITION BY cr.id ORDER BY c.name)
FROM collection_routes cr
CROSS JOIN users c
WHERE c.role = 'citizen'
AND (
    (cr.route_name LIKE '%Sector 15-16%' AND c.name IN ('Rajesh Kumar', 'Priya Sharma'))
    OR (cr.route_name LIKE '%Phase 1-2%' AND c.name IN ('Vikram Singh', 'Anita Gupta'))
    OR (cr.route_name LIKE '%Sector 8-9%' AND c.name IN ('Rohit Verma'))
);

-- Initialize citizen points
INSERT INTO citizen_points (citizen_id, points, total_submissions, avg_rating, streak_days)
SELECT 
    u.id,
    FLOOR(RANDOM() * 200) + 50, -- Random points between 50-250
    FLOOR(RANDOM() * 30) + 5,   -- Random submissions between 5-35
    ROUND((RANDOM() * 2 + 3)::numeric, 1), -- Random rating between 3.0-5.0
    FLOOR(RANDOM() * 15) + 1    -- Random streak between 1-15 days
FROM users u
WHERE u.role = 'citizen';

-- Insert sample waste submissions
INSERT INTO waste_submissions (citizen_id, category_id, ai_rating, feedback)
SELECT 
    c.id,
    wc.id,
    ROUND((RANDOM() * 2 + 3)::numeric, 1), -- Random rating between 3.0-5.0
    CASE 
        WHEN RANDOM() > 0.7 THEN 'Excellent segregation! Keep up the good work.'
        WHEN RANDOM() > 0.4 THEN 'Good effort. Minor improvements needed.'
        ELSE 'Well done! Proper waste segregation detected.'
    END
FROM users c
CROSS JOIN waste_categories wc
WHERE c.role = 'citizen'
AND RANDOM() > 0.6 -- Only create submissions for some combinations
LIMIT 50;
