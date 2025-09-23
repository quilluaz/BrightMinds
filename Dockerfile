FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY backend/pom.xml .
COPY backend/src ./src

RUN mvn package -Dmaven.test.skip=true

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=builder /app/target/BrightMinds-0.0.1-SNAPSHOT.jar app.jar

CMD ["java", "-jar", "app.jar"]