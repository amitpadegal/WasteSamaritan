-- Waste Samaritan Database Schema
-- This script sets up the initial database structure for the platform

-- Users table for all platform users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('citizen', 'collector', 'admin')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citizen profiles with address information
CREATE TABLE IF NOT EXISTS citizen_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    landmark VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waste categories
CREATE TABLE IF NOT EXISTS waste_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waste submissions by citizens
CREATE TABLE IF NOT EXISTS waste_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES waste_categories(id),
    image_url VARCHAR(500),
    ai_rating DECIMAL(2,1) CHECK (ai_rating >= 1 AND ai_rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection routes and assignments
CREATE TABLE IF NOT EXISTS collection_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collector_id UUID REFERENCES users(id) ON DELETE CASCADE,
    route_name VARCHAR(255) NOT NULL,
    area VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Houses assigned to collection routes
CREATE TABLE IF NOT EXISTS route_houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES collection_routes(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sequence_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection sessions
CREATE TABLE IF NOT EXISTS collection_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collector_id UUID REFERENCES users(id) ON DELETE CASCADE,
    route_id UUID REFERENCES collection_routes(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual house collections within a session
CREATE TABLE IF NOT EXISTS house_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES collection_sessions(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citizen ratings and feedback for collectors
CREATE TABLE IF NOT EXISTS collection_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES house_collections(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    collector_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamification points and achievements
CREATE TABLE IF NOT EXISTS citizen_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_submissions INTEGER DEFAULT 0,
    avg_rating DECIMAL(2,1) DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_submission_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_citizen ON waste_submissions(citizen_id);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_created ON waste_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_collection_sessions_collector ON collection_sessions(collector_id);
CREATE INDEX IF NOT EXISTS idx_house_collections_session ON house_collections(session_id);
CREATE INDEX IF NOT EXISTS idx_house_collections_citizen ON house_collections(citizen_id);
