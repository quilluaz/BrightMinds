# Auto-Save Progress Implementation Guide

## Overview

This implementation provides automatic progress saving functionality that tracks user progress through games and allows users to continue from where they left off or restart fresh.

## Key Features

### 1. **Automatic Progress Saving**

- Progress is automatically saved every time a user answers a question
- Tracks current scene, score, and question state
- No manual intervention required

### 2. **Progress Check Before Game Start**

- Before starting a game, the system checks for existing progress
- Offers users the option to continue or restart
- Prevents data loss from connection issues

### 3. **Smart Progress Management**

- Only one progress record per user-story combination
- Automatic cleanup after game completion
- Efficient database usage

## API Endpoints

### Game Progress Management

#### 1. Check Game Progress

```
GET /api/game/progress/check/{userId}/{storyId}
```

**Response:**

```json
{
  "userId": 1,
  "storyId": 1,
  "currentSceneId": 5,
  "currentSceneOrder": 5,
  "score": 12,
  "lastAccessed": "2024-01-15T10:30:00",
  "perQuestionState": {
    "question1": "answered",
    "question2": "correct"
  },
  "hasExistingProgress": true
}
```

#### 2. Start Game (with progress check)

```
POST /api/game/start/{userId}/{storyId}
```

**Response:**

- If existing progress: Returns progress details for user decision
- If no progress: Returns fresh start information

#### 3. Continue Game

```
POST /api/game/continue/{userId}/{storyId}
```

**Response:** Returns existing progress details

#### 4. Restart Game

```
POST /api/game/restart/{userId}/{storyId}
```

**Response:** Deletes existing progress and returns fresh start

#### 5. Get Next Scene

```
GET /api/game/next-scene/{userId}/{storyId}
```

**Response:** Returns the next scene ID based on current progress

#### 6. Save Progress (Manual)

```
POST /api/game/progress/save
```

**Request Body:**

```json
{
  "userId": 1,
  "storyId": 1,
  "sceneId": 5,
  "questionId": 10,
  "givenAnswer": "Bundok",
  "isCorrect": true,
  "pointsEarned": 4,
  "perQuestionState": {
    "question1": "answered",
    "question2": "correct"
  }
}
```

## Frontend Integration

### 1. **Before Starting Game**

```javascript
// Check for existing progress before starting game
async function checkGameProgress(userId, storyId) {
  try {
    const response = await fetch(
      `/api/game/progress/check/${userId}/${storyId}`
    );
    const progress = await response.json();

    if (progress.hasExistingProgress) {
      // Show dialog to user
      const userChoice = await showContinueDialog(progress);

      if (userChoice === "continue") {
        return await continueGame(userId, storyId);
      } else if (userChoice === "restart") {
        return await restartGame(userId, storyId);
      }
    } else {
      // No existing progress, start fresh
      return await startFreshGame(userId, storyId);
    }
  } catch (error) {
    console.error("Error checking progress:", error);
  }
}

function showContinueDialog(progress) {
  return new Promise((resolve) => {
    // Show modal with options
    const modal = document.createElement("div");
    modal.innerHTML = `
      <div class="progress-modal">
        <h3>Continue Your Adventure?</h3>
        <p>You have existing progress:</p>
        <ul>
          <li>Current Scene: ${progress.currentSceneOrder}</li>
          <li>Score: ${progress.score} points</li>
          <li>Last Played: ${new Date(
            progress.lastAccessed
          ).toLocaleString()}</li>
        </ul>
        <button onclick="resolve('continue')">Continue</button>
        <button onclick="resolve('restart')">Start Over</button>
      </div>
    `;
    document.body.appendChild(modal);
  });
}
```

### 2. **Automatic Progress Saving**

The progress is automatically saved when users answer questions. No additional frontend code is needed for this functionality.

```javascript
// When user answers a question, this happens automatically
async function submitAnswer(userId, questionId, answer) {
  try {
    const response = await fetch(
      `/api/user-responses/user/${userId}/question/${questionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          givenAnswer: answer,
          isCorrect: checkAnswer(answer), // Your validation logic
          submittedAt: new Date().toISOString(),
        }),
      }
    );

    if (response.ok) {
      // Progress is automatically saved in the backend
      // You can proceed to next scene
      const nextSceneId = await getNextScene(userId, storyId);
      loadScene(nextSceneId);
    }
  } catch (error) {
    console.error("Error submitting answer:", error);
  }
}
```

### 3. **Getting Next Scene**

```javascript
async function getNextScene(userId, storyId) {
  try {
    const response = await fetch(`/api/game/next-scene/${userId}/${storyId}`);
    const nextSceneId = await response.json();
    return nextSceneId;
  } catch (error) {
    console.error("Error getting next scene:", error);
  }
}
```

## Backend Flow

### 1. **User Answers Question**

1. User submits answer via `POST /api/user-responses/user/{userId}/question/{questionId}`
2. `UserResponseController.create()` saves the response
3. Automatically calls `ProgressService.saveProgressAfterAnswer()`
4. Progress is updated with new scene, score, and question state

### 2. **User Starts Game**

1. Frontend calls `POST /api/game/start/{userId}/{storyId}`
2. `GameController.startGame()` calls `ProgressService.checkExistingProgress()`
3. Returns progress information for user decision

### 3. **User Continues Game**

1. Frontend calls `POST /api/game/continue/{userId}/{storyId}`
2. Returns existing progress details
3. Frontend loads the appropriate scene

### 4. **User Restarts Game**

1. Frontend calls `POST /api/game/restart/{userId}/{storyId}`
2. `ProgressService.deleteByUserAndStory()` removes existing progress
3. Returns fresh start information

## Database Schema

### Progress Table

```sql
CREATE TABLE Progress (
    progress_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id),
    story_id INTEGER NOT NULL REFERENCES stories(story_id),
    current_scene VARCHAR(255),
    score INTEGER,
    last_accessed TIMESTAMP,
    per_question_state JSONB
);
```

### UserResponse Table (existing)

```sql
CREATE TABLE user_responses (
    response_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id),
    question_id INTEGER NOT NULL REFERENCES questions(question_id),
    given_answer VARCHAR(255),
    is_correct BOOLEAN,
    submitted_at TIMESTAMP
);
```

## Error Handling

### Frontend Error Handling

```javascript
async function handleGameProgress(userId, storyId) {
  try {
    const progress = await checkGameProgress(userId, storyId);
    // Handle progress
  } catch (error) {
    if (error.status === 404) {
      // No progress found, start fresh
      startFreshGame(userId, storyId);
    } else if (error.status === 500) {
      // Server error, show error message
      showErrorMessage("Unable to load game progress. Please try again.");
    }
  }
}
```

### Backend Error Handling

- All endpoints include proper try-catch blocks
- Returns appropriate HTTP status codes
- Logs errors for debugging
- Graceful degradation when progress saving fails

## Testing

### Test Scenarios

1. **Fresh Start**

   - User with no existing progress starts game
   - Should create new progress record

2. **Continue Existing**

   - User with existing progress chooses to continue
   - Should return existing progress details

3. **Restart Game**

   - User with existing progress chooses to restart
   - Should delete existing progress and start fresh

4. **Auto-Save After Answer**

   - User answers question
   - Progress should be automatically updated

5. **Connection Loss Recovery**
   - User loses connection mid-game
   - Should be able to continue from last saved progress

## Performance Considerations

- Progress queries are optimized with proper indexing
- Only one progress record per user-story combination
- Automatic cleanup after game completion
- Efficient JSON storage for question states

## Security Considerations

- User can only access their own progress
- Proper validation of user IDs and story IDs
- SQL injection protection through JPA
- Input validation on all endpoints

## Monitoring and Logging

- Progress save operations are logged
- Error conditions are captured and logged
- Performance metrics can be added for monitoring
- Database query performance should be monitored

This implementation provides a robust, user-friendly progress tracking system that handles all the scenarios you mentioned while maintaining data integrity and performance.
