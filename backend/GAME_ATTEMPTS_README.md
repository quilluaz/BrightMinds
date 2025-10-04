# Game Attempts System

This document describes the Game Attempts system that has been implemented to store user scores and attempt history for match history functionality.

## Overview

The Game Attempts system allows you to:

- Store individual game attempts with scores and timestamps
- Track user performance over time
- Provide match history functionality similar to gaming platforms
- Analyze user progress and statistics

## Components

### 1. GameAttempt Entity

**File:** `entity/GameAttempt.java`

Stores individual game attempts with the following fields:

- `attemptId`: Primary key
- `user`: Reference to the user who made the attempt
- `story`: Reference to the story/game that was attempted
- `score`: Score achieved in this attempt
- `totalPossibleScore`: Maximum possible score
- `percentage`: Calculated percentage score
- `attemptDate`: Timestamp when the attempt was made
- `completionTimeSeconds`: Time taken to complete (optional)
- `questionsAnswered`: Total questions answered (optional)
- `questionsCorrect`: Questions answered correctly (optional)

### 2. GameAttemptDTO

**File:** `dto/GameAttemptDTO.java`

Data Transfer Object for API responses, includes:

- All attempt data
- Story title for easy display
- User ID for reference

### 3. GameAttemptRepository

**File:** `repository/GameAttemptRepository.java`

Provides database operations including:

- Find attempts by user (ordered by date)
- Find attempts for specific story
- Find best/latest attempts
- Count attempts and calculate averages
- Date range and score filtering

### 4. GameAttemptService

**File:** `service/GameAttemptService.java`

Business logic for:

- Saving new attempts
- Retrieving user match history
- Calculating statistics
- Pagination support

### 5. GameAttemptController

**File:** `controller/GameAttemptController.java`

REST API endpoints:

- `POST /api/game-attempts` - Save new attempt
- `GET /api/game-attempts/user/{userId}` - Get user's match history
- `GET /api/game-attempts/user/{userId}/paginated` - Paginated history
- `GET /api/game-attempts/user/{userId}/story/{storyId}` - Attempts for specific story
- `GET /api/game-attempts/user/{userId}/story/{storyId}/best` - Best attempt for story
- `GET /api/game-attempts/user/{userId}/story/{storyId}/latest` - Latest attempt for story
- `GET /api/game-attempts/user/{userId}/statistics` - User statistics
- `GET /api/game-attempts/user/{userId}/date-range` - Attempts in date range
- `GET /api/game-attempts/user/{userId}/score-above` - Attempts above score threshold

### 6. GameCompletionHelper

**File:** `service/GameCompletionHelper.java`

Helper service to integrate with existing Progress system:

- `recordGameCompletion()` - Automatically record attempt when game is completed
- `recordGameCompletionWithCustomScore()` - Record with custom scoring

## Database Schema

The `game_attempts` table includes:

- Primary key and foreign key constraints
- Check constraints for data validation
- Indexes for optimal query performance
- Comments for documentation

## Usage Examples

### Recording a Game Attempt

```java
@Autowired
private GameCompletionHelper gameCompletionHelper;

// When a user completes a game
LocalDateTime startTime = LocalDateTime.now().minusMinutes(30); // Example start time
GameAttemptDTO attempt = gameCompletionHelper.recordGameCompletion(userId, storyId, startTime);
```

### Retrieving Match History

```java
@Autowired
private GameAttemptService gameAttemptService;

// Get all attempts for a user
List<GameAttemptDTO> history = gameAttemptService.getUserAttempts(userId);

// Get paginated history
Page<GameAttemptDTO> paginatedHistory = gameAttemptService.getUserAttemptsPaginated(userId, 0, 10);

// Get attempts for specific story
List<GameAttemptDTO> storyAttempts = gameAttemptService.getUserAttemptsForStory(userId, storyId);
```

### API Usage

```bash
# Save a new attempt
POST /api/game-attempts
Content-Type: application/x-www-form-urlencoded

userId=1&storyId=1&score=85&totalPossibleScore=100&completionTimeSeconds=1800&questionsAnswered=10&questionsCorrect=8

# Get user's match history
GET /api/game-attempts/user/1

# Get paginated history
GET /api/game-attempts/user/1/paginated?page=0&size=10

# Get best attempt for a story
GET /api/game-attempts/user/1/story/1/best

# Get user statistics
GET /api/game-attempts/user/1/statistics
```

## Integration with Existing System

The Game Attempts system is designed to work alongside your existing Progress system:

1. **Progress Entity**: Continues to track current progress and state
2. **GameAttempt Entity**: Records individual completed attempts
3. **GameCompletionHelper**: Bridges the two systems

## Frontend Integration

For the frontend, you can now:

1. **Display Match History**: Show a list of all user attempts with dates and scores
2. **Show Statistics**: Display average scores, total attempts, best scores
3. **Filter and Search**: Allow users to filter by date, story, or score
4. **Progress Tracking**: Show improvement over time

## Future Enhancements

Consider implementing:

- Leaderboards based on best scores
- Achievement system based on attempt milestones
- Analytics dashboard for administrators
- Export functionality for user data
- Comparison features between attempts

## Database Migration

Run the migration script to create the table:

```sql
-- Execute the contents of backend/database_migrations/add_game_attempts_table.sql
```

This will create the `game_attempts` table with all necessary constraints and indexes.
