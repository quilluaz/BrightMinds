-- BrightMinds PostgreSQL Database Setup Script
-- Run this script in DBeaver or any PostgreSQL client

-- Create database (run as superuser)
-- CREATE DATABASE brightminds;

-- Connect to the brightminds database
-- \c brightminds;

-- Create schema if needed
-- CREATE SCHEMA IF NOT EXISTS public;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON DATABASE brightminds TO postgres;
-- GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;

-- The following tables will be created automatically by Hibernate
-- when the application starts with spring.jpa.hibernate.ddl-auto=update

-- Expected tables structure:
/*
CREATE TABLE IF NOT EXISTS badge (
    badge_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    image_url VARCHAR(255),
    "condition" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "User" (
    user_id BIGSERIAL PRIMARY KEY,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS story (
    story_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    narration_url VARCHAR(255),
    story_order INTEGER,
    thumbnail_image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS scene (
    scene_id SERIAL PRIMARY KEY,
    story_id INTEGER REFERENCES story(story_id),
    scene_order INTEGER,
    scene_text TEXT,
    voiceover_url VARCHAR(255),
    background_image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS question (
    question_id SERIAL PRIMARY KEY,
    scene_id INTEGER,
    type VARCHAR(20),
    prompt_text TEXT,
    question_image_url VARCHAR(255),
    points INTEGER
);

CREATE TABLE IF NOT EXISTS choice (
    choice_id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES question(question_id),
    choice_text TEXT,
    is_correct BOOLEAN,
    choice_image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS answer (
    answer_id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES question(question_id),
    answer_text TEXT,
    dragdrop_position INTEGER
);

CREATE TABLE IF NOT EXISTS dialogue (
    dialogue_id UUID PRIMARY KEY,
    scene_id INTEGER NOT NULL REFERENCES scene(scene_id),
    character_name TEXT,
    line_text TEXT,
    voice_asset_id BIGINT REFERENCES asset(asset_id),
    order_index INTEGER,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS "Progress" (
    progress_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES "User"(user_id),
    story_id INTEGER NOT NULL REFERENCES story(story_id),
    current_scene VARCHAR(255),
    score INTEGER,
    last_accessed TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_response (
    response_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES "User"(user_id),
    question_id INTEGER REFERENCES question(question_id),
    given_answer TEXT,
    is_correct BOOLEAN,
    submitted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_badge (
    user_badge_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES "User"(user_id),
    badge_id BIGINT REFERENCES badge(badge_id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

-- Sample data insertion (optional)
-- You can uncomment and modify these as needed

/*
-- Insert sample stories
INSERT INTO story (title, description, narration_url, story_order, thumbnail_image) VALUES
('The Adventure Begins', 'A young explorer starts their journey', 'https://example.com/narration1.mp3', 1, 'https://example.com/thumb1.jpg'),
('The Mysterious Forest', 'Deep in the woods, secrets await', 'https://example.com/narration2.mp3', 2, 'https://example.com/thumb2.jpg');

-- Insert sample scenes
INSERT INTO scene (story_id, scene_order, scene_text, voiceover_url, background_image_url) VALUES
(1, 1, 'You stand at the edge of a vast forest...', 'https://example.com/voice1.mp3', 'https://example.com/bg1.jpg'),
(1, 2, 'The path ahead splits into three directions...', 'https://example.com/voice2.mp3', 'https://example.com/bg2.jpg');

-- Insert sample questions
INSERT INTO question (scene_id, type, prompt_text, question_image_url, points) VALUES
(1, 'MCQ', 'Which path should you take?', 'https://example.com/q1.jpg', 10),
(1, 'DragDog', 'Arrange the items in the correct order', 'https://example.com/q2.jpg', 15);

-- Insert sample choices
INSERT INTO choice (question_id, choice_text, is_correct, choice_image_url) VALUES
(1, 'The left path', true, 'https://example.com/choice1.jpg'),
(1, 'The right path', false, 'https://example.com/choice2.jpg'),
(1, 'The middle path', false, 'https://example.com/choice3.jpg');

-- Insert sample answers
INSERT INTO answer (question_id, answer_text, dragdrop_position) VALUES
(1, 'The left path is the correct choice', NULL),
(2, 'Item 1, Item 2, Item 3', 1);

-- Insert sample badges
INSERT INTO badge (name, description, image_url, "condition") VALUES
('First Steps', 'Complete your first story', 'https://example.com/badge1.png', 1),
('Explorer', 'Complete 5 stories', 'https://example.com/badge2.png', 5),
('Master', 'Complete 10 stories', 'https://example.com/badge3.png', 10);
*/

-- Verify database connection and basic setup
SELECT 'PostgreSQL database setup completed successfully!' as status;
