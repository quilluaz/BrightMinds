# Progress Functionality Implementation

## Overview

This document describes the enhanced progress functionality that allows users to either continue their existing progress or start a new attempt when they encounter connection issues or other unforeseen circumstances.

## Key Features

### 1. Duplicate Prevention

- **Automatic Cleanup**: When a user starts a new attempt, any existing progress for the same user-story combination is automatically deleted to prevent duplicates and save database space.
- **Single Progress Per User-Story**: Only one progress record is maintained per user-story combination at any time.

### 2. Continue vs Start New Logic

- **Continue Progress**: Updates existing progress or creates new if none exists
- **Start New Attempt**: Deletes existing progress and creates a fresh progress record

### 3. Automatic Cleanup After Completion

- **Progress Deletion**: When a game is completed and recorded in the game attempts table, the progress record is automatically deleted to free up space.

## API Endpoints

### Core Progress Endpoints

#### 1. Get Progress by User and Story

```
GET /api/progress/user/{userId}/story/{storyId}
```

Returns the current progress for a specific user-story combination.

#### 2. Start New Attempt

```
POST /api/progress/start-new
```

Deletes any existing progress and creates a fresh progress record.

**Request Body:**

```json
{
  "userId": 1,
  "storyId": 1,
  "currentScene": "scene1",
  "score": 0,
  "perQuestionState": {}
}
```

#### 3. Continue Progress

```
POST /api/progress/continue
```

Updates existing progress or creates new if none exists.

**Request Body:** Same as start-new

#### 4. Unified Action Endpoint

```
POST /api/progress/action
```

Handles both continue and start-new actions in a single endpoint.

**Request Body:**

```json
{
  "userId": 1,
  "storyId": 1,
  "currentScene": "scene1",
  "score": 0,
  "perQuestionState": {},
  "action": "continue" // or "start_new"
}
```

#### 5. Delete Progress by User and Story

```
DELETE /api/progress/user/{userId}/story/{storyId}
```

Manually deletes progress for a specific user-story combination.

## Service Methods

### ProgressService

#### New Methods Added:

1. **`getByUserAndStory(Long userId, Integer storyId)`**

   - Returns progress for a specific user-story combination

2. **`startNewAttempt(ProgressRequestDTO req)`**

   - Deletes existing progress and creates new progress record

3. **`continueProgress(ProgressRequestDTO req)`**

   - Updates existing progress or creates new if none exists

4. **`deleteByUserAndStory(Long userId, Integer storyId)`**

   - Deletes progress by user and story combination

5. **`deleteProgressAfterCompletion(Long userId, Integer storyId)`**
   - Called automatically after game completion

### Enhanced Methods:

1. **`create(ProgressRequestDTO req)`**
   - Now checks for existing progress and updates instead of creating duplicates

## Game Completion Integration

### GameCompletionHelper Updates

The `GameCompletionHelper` service has been updated to automatically delete progress records after successful game completion:

1. **`recordGameCompletion()`** - Automatically deletes progress after recording attempt
2. **`recordGameCompletionWithCustomScore()`** - Automatically deletes progress after recording attempt

## Usage Scenarios

### Scenario 1: User Loses Connection

1. User is playing a game and loses connection
2. User reconnects and wants to continue where they left off
3. Frontend calls `GET /api/progress/user/{userId}/story/{storyId}` to check for existing progress
4. If progress exists, frontend calls `POST /api/progress/continue` to resume
5. If no progress exists, frontend calls `POST /api/progress/start-new` to begin fresh

### Scenario 2: User Wants Fresh Start

1. User wants to restart a game they were playing
2. Frontend calls `POST /api/progress/start-new`
3. System automatically deletes any existing progress and creates fresh record

### Scenario 3: Game Completion

1. User completes a game
2. System calls `GameCompletionHelper.recordGameCompletion()`
3. Game attempt is recorded in the game_attempts table
4. Progress record is automatically deleted to free up space

## Database Considerations

### Space Optimization

- Only one progress record per user-story combination
- Automatic cleanup after game completion
- No orphaned or duplicate progress records

### Data Integrity

- Foreign key constraints maintained
- Transactional operations ensure data consistency
- Proper error handling for edge cases

## Error Handling

All endpoints include proper error handling:

- **400 Bad Request**: Invalid request data
- **404 Not Found**: Progress not found
- **500 Internal Server Error**: Server-side errors

## Testing Recommendations

### Test Cases to Implement:

1. **Duplicate Prevention**

   - Create progress for user-story combination
   - Try to create another progress for same combination
   - Verify only one record exists

2. **Start New vs Continue**

   - Create progress with specific scene and score
   - Call start-new with different scene/score
   - Verify old progress is deleted and new one created
   - Call continue with updated scene/score
   - Verify existing progress is updated

3. **Game Completion Cleanup**

   - Create progress for user-story
   - Complete game and record attempt
   - Verify progress is automatically deleted

4. **Edge Cases**
   - Try to continue when no progress exists
   - Try to start new when no progress exists
   - Handle invalid user/story IDs

## Migration Notes

This implementation is backward compatible with existing progress functionality. Existing endpoints continue to work as before, with new endpoints added for enhanced functionality.

## Future Enhancements

Potential future improvements:

1. Progress expiration (auto-delete old progress)
2. Progress backup/restore functionality
3. Progress analytics and reporting
4. Batch progress operations
