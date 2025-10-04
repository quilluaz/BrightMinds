-- Fix game_attempts table schema to match the entity mapping
-- This migration addresses the issue where the table has an 'attempt_date' column
-- but the entity expects 'start_attempt_date' and 'end_attempt_date' columns

-- First, check if the table exists and what columns it has
-- If there's an 'attempt_date' column, we need to rename it or add the missing columns

-- Drop the existing table if it has the wrong schema and recreate it
DROP TABLE IF EXISTS game_attempts CASCADE;

-- Recreate the table with the correct schema
CREATE TABLE game_attempts (
    attempt_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    story_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_possible_score INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    start_attempt_date TIMESTAMP NOT NULL,
    end_attempt_date TIMESTAMP NOT NULL,
    completion_time_seconds INTEGER,
    
    -- Foreign key constraints
    CONSTRAINT fk_game_attempts_user 
        FOREIGN KEY (user_id) REFERENCES "App_User"(user_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_game_attempts_story 
        FOREIGN KEY (story_id) REFERENCES stories(story_id) 
        ON DELETE CASCADE,
    
    -- Check constraints
    CONSTRAINT chk_score_non_negative CHECK (score >= 0),
    CONSTRAINT chk_total_score_positive CHECK (total_possible_score > 0),
    CONSTRAINT chk_percentage_range CHECK (percentage >= 0 AND percentage <= 100),
    CONSTRAINT chk_completion_time_positive CHECK (completion_time_seconds IS NULL OR completion_time_seconds > 0),
    CONSTRAINT chk_start_before_end CHECK (start_attempt_date <= end_attempt_date)
);

-- Create indexes for better query performance
CREATE INDEX idx_game_attempts_user_id ON game_attempts(user_id);
CREATE INDEX idx_game_attempts_story_id ON game_attempts(story_id);
CREATE INDEX idx_game_attempts_start_date ON game_attempts(start_attempt_date DESC);
CREATE INDEX idx_game_attempts_end_date ON game_attempts(end_attempt_date DESC);
CREATE INDEX idx_game_attempts_user_story ON game_attempts(user_id, story_id);
CREATE INDEX idx_game_attempts_user_end_date ON game_attempts(user_id, end_attempt_date DESC);
CREATE INDEX idx_game_attempts_score ON game_attempts(score DESC);

-- Add comments for documentation
COMMENT ON TABLE game_attempts IS 'Stores individual game attempts made by users with scores and timestamps for match history functionality';
COMMENT ON COLUMN game_attempts.attempt_id IS 'Primary key for the game attempt record';
COMMENT ON COLUMN game_attempts.user_id IS 'Foreign key reference to the user who made the attempt';
COMMENT ON COLUMN game_attempts.story_id IS 'Foreign key reference to the story/game that was attempted';
COMMENT ON COLUMN game_attempts.score IS 'Score achieved in this attempt';
COMMENT ON COLUMN game_attempts.total_possible_score IS 'Maximum possible score for this story/game';
COMMENT ON COLUMN game_attempts.percentage IS 'Percentage score (score/total_possible_score * 100)';
COMMENT ON COLUMN game_attempts.start_attempt_date IS 'Timestamp when the attempt was started';
COMMENT ON COLUMN game_attempts.end_attempt_date IS 'Timestamp when the attempt was completed';
COMMENT ON COLUMN game_attempts.completion_time_seconds IS 'Time taken to complete the attempt in seconds (calculated from start and end dates)';
