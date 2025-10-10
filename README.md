# BrightMinds

A comprehensive educational application with a modern frontend and robust Spring Boot backend API.

## Project Structure

```
BrightMinds/
├── frontend/          # Frontend application
└── backend/           # Spring Boot REST API
    ├── src/
    │   ├── main/
    │   │   ├── java/JIZAS/BrightMinds/
    │   │   │   ├── entity/           # JPA Entities
    │   │   │   ├── repository/       # Data Access Layer
    │   │   │   ├── service/         # Business Logic Layer
    │   │   │   ├── controller/      # REST Controllers
    │   │   │   ├── dto/            # Data Transfer Objects
    │   │   │   └── BrightMindsApplication.java
    │   │   └── resources/
    │   │       └── application.properties
    │   └── test/
    └── pom.xml
```

## Backend API

The backend is a Spring Boot application that provides a RESTful API for managing educational content including:

- **Questions**: Multiple choice, drag-and-drop, and identification questions
- **Choices**: Answer choices for multiple choice questions
- **Answers**: Text-based answers with optional drag-and-drop positioning
- **Game Attempts**: Track user progress and completion times
- **Progress**: Per-scene progress tracking with auto-save functionality

### Features

- Full CRUD operations for all entities
- RESTful API design with proper HTTP status codes
- JPA/Hibernate for database operations
- MySQL database integration
- Comprehensive error handling
- CORS support for frontend integration
- Game attempt tracking and statistics
- Auto-save progress functionality

### API Endpoints

#### Questions API

- `POST /api/questions` - Create question
- `GET /api/questions` - Get all questions
- `GET /api/questions/{questionId}` - Get question by ID
- `GET /api/questions/{questionId}/full` - Get question with choices and answers
- `GET /api/questions/scene/{sceneId}` - Get questions by scene
- `GET /api/questions/type/{type}` - Get questions by type (MCQ, DragDog, ID)
- `PUT /api/questions/{questionId}` - Update question
- `DELETE /api/questions/{questionId}` - Delete question

#### Choices API

- `POST /api/choices` - Create choice
- `POST /api/choices/question/{questionId}` - Create choice for question
- `GET /api/choices` - Get all choices
- `GET /api/choices/question/{questionId}` - Get choices by question
- `GET /api/choices/question/{questionId}/correct` - Get correct choices
- `PUT /api/choices/{choiceId}` - Update choice
- `DELETE /api/choices/{choiceId}` - Delete choice

#### Answers API

- `POST /api/answers` - Create answer
- `POST /api/answers/question/{questionId}` - Create answer for question
- `GET /api/answers` - Get all answers
- `GET /api/answers/question/{questionId}` - Get answers by question
- `PUT /api/answers/{answerId}` - Update answer
- `DELETE /api/answers/{answerId}` - Delete answer

#### Game Attempts API

- `POST /api/game-attempts` - Save game attempt
- `GET /api/game-attempts/user/{userId}` - Get user's attempts
- `GET /api/game-attempts/user/{userId}/statistics` - Get user statistics

#### Progress API

- `GET /api/progress/user/{userId}/story/{storyId}` - Get user progress
- `POST /api/progress/auto-save` - Auto-save progress
- `PUT /api/progress/{progressId}` - Update progress

## Frontend

The frontend application (details to be added).

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher
- Node.js (for frontend)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Configure your database in `src/main/resources/application.properties`

3. Run the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

4. The API will be available at `http://localhost:8080`

### Frontend Setup

(To be added)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
