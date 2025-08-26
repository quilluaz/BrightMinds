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

### Features

- Full CRUD operations for all entities
- RESTful API design with proper HTTP status codes
- JPA/Hibernate for database operations
- MySQL database integration
- Comprehensive error handling
- CORS support for frontend integration

### API Documentation

For detailed API documentation, see the [Backend README](backend/README.md).

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