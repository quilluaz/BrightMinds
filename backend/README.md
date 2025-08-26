# BrightMinds API

A Spring Boot REST API for managing questions, choices, and answers in an educational application.

## Project Structure

The project follows the MVC (Model-View-Controller) pattern with the following structure:

```
src/main/java/JIZAS/BrightMinds/
├── entity/           # JPA Entities
│   ├── Question.java
│   ├── Choice.java
│   └── Answer.java
├── repository/       # Data Access Layer
│   ├── QuestionRepository.java
│   ├── ChoiceRepository.java
│   └── AnswerRepository.java
├── service/         # Business Logic Layer
│   ├── QuestionService.java
│   ├── ChoiceService.java
│   └── AnswerService.java
├── controller/      # REST Controllers
│   ├── QuestionController.java
│   ├── ChoiceController.java
│   └── AnswerController.java
├── dto/            # Data Transfer Objects
│   ├── QuestionDTO.java
│   ├── ChoiceDTO.java
│   └── AnswerDTO.java
└── BrightMindsApplication.java
```

## Database Schema

### Question Table
- `question_id` (PK) - INT autoincrement
- `scene_id` (FK) - INT
- `type` - ENUM ['MCQ', 'DragDog', 'ID']
- `prompt_text` - TEXT
- `question_image_url` - TEXT (URL)
- `points` - INT

### Choice Table
- `choice_id` (PK) - INT autoincrement
- `question_id` (FK) - INT
- `choice_text` - TEXT
- `is_correct` - BOOLEAN
- `choice_image_url` - TEXT (URL)

### Answer Table
- `answer_id` (PK) - INT autoincrement
- `question_id` (FK) - INT
- `answer_text` - TEXT
- `dragdrop_position` - INT (nullable)

## API Endpoints

### Questions API

#### Create Question
```
POST /api/questions
Content-Type: application/json

{
  "sceneId": 1,
  "type": "MCQ",
  "promptText": "What is the capital of France?",
  "questionImageUrl": "https://example.com/image.jpg",
  "points": 10
}
```

#### Get All Questions
```
GET /api/questions
```

#### Get Question by ID
```
GET /api/questions/{questionId}
```

#### Get Question with Choices and Answers
```
GET /api/questions/{questionId}/full
```

#### Get Questions by Scene ID
```
GET /api/questions/scene/{sceneId}
```

#### Get Questions by Scene ID with Choices and Answers
```
GET /api/questions/scene/{sceneId}/full
```

#### Get Questions by Type
```
GET /api/questions/type/{type}
```
Types: MCQ, DragDog, ID

#### Get Questions by Scene ID and Type
```
GET /api/questions/scene/{sceneId}/type/{type}
```

#### Get Questions by Points
```
GET /api/questions/points/{points}
```

#### Update Question
```
PUT /api/questions/{questionId}
Content-Type: application/json

{
  "sceneId": 1,
  "type": "MCQ",
  "promptText": "Updated question text",
  "questionImageUrl": "https://example.com/updated-image.jpg",
  "points": 15
}
```

#### Delete Question
```
DELETE /api/questions/{questionId}
```

### Choices API

#### Create Choice
```
POST /api/choices
Content-Type: application/json

{
  "choiceText": "Paris",
  "isCorrect": true,
  "choiceImageUrl": "https://example.com/choice-image.jpg"
}
```

#### Create Choice for Question
```
POST /api/choices/question/{questionId}
Content-Type: application/json

{
  "choiceText": "Paris",
  "isCorrect": true,
  "choiceImageUrl": "https://example.com/choice-image.jpg"
}
```

#### Get All Choices
```
GET /api/choices
```

#### Get Choice by ID
```
GET /api/choices/{choiceId}
```

#### Get Choices by Question ID
```
GET /api/choices/question/{questionId}
```

#### Get Correct Choices by Question ID
```
GET /api/choices/question/{questionId}/correct
```

#### Get Incorrect Choices by Question ID
```
GET /api/choices/question/{questionId}/incorrect
```

#### Get Choices by Question ID and Correct Status
```
GET /api/choices/question/{questionId}/status/{isCorrect}
```

#### Get Choices with Question Details
```
GET /api/choices/question/{questionId}/with-details
```

#### Update Choice
```
PUT /api/choices/{choiceId}
Content-Type: application/json

{
  "choiceText": "Updated choice text",
  "isCorrect": false,
  "choiceImageUrl": "https://example.com/updated-choice-image.jpg"
}
```

#### Delete Choice
```
DELETE /api/choices/{choiceId}
```

#### Delete All Choices for Question
```
DELETE /api/choices/question/{questionId}
```

### Answers API

#### Create Answer
```
POST /api/answers
Content-Type: application/json

{
  "answerText": "Paris is the capital of France",
  "dragdropPosition": 1
}
```

#### Create Answer for Question
```
POST /api/answers/question/{questionId}
Content-Type: application/json

{
  "answerText": "Paris is the capital of France",
  "dragdropPosition": 1
}
```

#### Get All Answers
```
GET /api/answers
```

#### Get Answer by ID
```
GET /api/answers/{answerId}
```

#### Get Answers by Question ID
```
GET /api/answers/question/{questionId}
```

#### Get Answers by Question ID (Ordered)
```
GET /api/answers/question/{questionId}/ordered
```

#### Get Answers with Dragdrop Position
```
GET /api/answers/question/{questionId}/with-position
```

#### Get Answers without Dragdrop Position
```
GET /api/answers/question/{questionId}/without-position
```

#### Get Answer by Question ID and Dragdrop Position
```
GET /api/answers/question/{questionId}/position/{dragdropPosition}
```

#### Get Answers with Question Details
```
GET /api/answers/question/{questionId}/with-details
```

#### Update Answer
```
PUT /api/answers/{answerId}
Content-Type: application/json

{
  "answerText": "Updated answer text",
  "dragdropPosition": 2
}
```

#### Delete Answer
```
DELETE /api/answers/{answerId}
```

#### Delete All Answers for Question
```
DELETE /api/answers/question/{questionId}
```

## Setup Instructions

1. **Prerequisites**
   - Java 17 or higher
   - Maven 3.6 or higher
   - MySQL 8.0 or higher

2. **Database Setup**
   - Create a MySQL database named `brightminds`
   - Update database credentials in `application.properties` if needed

3. **Run the Application**
   ```bash
   cd BrightMinds
   mvn spring-boot:run
   ```

4. **Access the API**
   - Base URL: `http://localhost:8080`
   - API Documentation: Available at the endpoints listed above

## Features

- **CRUD Operations**: Full Create, Read, Update, Delete operations for all entities
- **Relationship Management**: Proper handling of relationships between Questions, Choices, and Answers
- **Flexible Querying**: Multiple ways to query data based on different criteria
- **Data Transfer Objects**: Clean separation between API and database layers
- **Error Handling**: Proper HTTP status codes and error responses
- **Cross-Origin Support**: CORS enabled for frontend integration

## Question Types

- **MCQ**: Multiple Choice Questions
- **DragDog**: Drag and Drop Questions
- **ID**: Identification Questions

## Database Relationships

- One Question can have many Choices (One-to-Many)
- One Question can have many Answers (One-to-Many)
- Choices and Answers are linked to Questions via foreign keys

## Notes

- The `dragdrop_position` field in the Answer entity is nullable and used for drag-and-drop type questions
- The `is_correct` field in the Choice entity determines if a choice is correct for MCQ questions
- Image URLs are stored as text fields and should contain valid URLs
- The API uses Spring Boot's automatic table creation with `hibernate.ddl-auto=update`
