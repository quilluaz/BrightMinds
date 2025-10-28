package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.GameAttemptDTO;
import JIZAS.BrightMinds.service.GameAttemptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/game-attempts")
@Tag(name = "Game Attempts", description = "API for managing game attempts and match history")
@CrossOrigin(origins = "*")
public class GameAttemptController {

    @Autowired
    private GameAttemptService gameAttemptService;

    @PostMapping
    @Operation(summary = "Save a new game attempt", 
               description = "Records a new game attempt with score and completion details")
    public ResponseEntity<GameAttemptDTO> saveGameAttempt(
            @Parameter(description = "User ID") @RequestParam Long userId,
            @Parameter(description = "Story ID") @RequestParam Integer storyId,
            @Parameter(description = "Score achieved") @RequestParam Integer score,
            @Parameter(description = "Total possible score") @RequestParam Integer totalPossibleScore,
            @Parameter(description = "Start attempt date (ISO format)") 
            @RequestParam String startAttemptDate,
            @Parameter(description = "End attempt date (ISO format)") 
            @RequestParam String endAttemptDate) {
        
        System.out.println("GameAttemptController: Received request to save game attempt");
        System.out.println("Parameters: userId=" + userId + ", storyId=" + storyId + ", score=" + score + 
                          ", totalPossibleScore=" + totalPossibleScore + ", startDate=" + startAttemptDate + 
                          ", endDate=" + endAttemptDate);
        
        try {
            // Parse the ISO date strings to LocalDateTime
            // Handle both with and without timezone (Z) suffix
            String startDateStr = startAttemptDate.endsWith("Z") ? 
                startAttemptDate.substring(0, startAttemptDate.length() - 1) : startAttemptDate;
            String endDateStr = endAttemptDate.endsWith("Z") ? 
                endAttemptDate.substring(0, endAttemptDate.length() - 1) : endAttemptDate;
            
            LocalDateTime startDate = LocalDateTime.parse(startDateStr);
            LocalDateTime endDate = LocalDateTime.parse(endDateStr);
            
            GameAttemptDTO attempt = gameAttemptService.saveGameAttempt(
                    userId, storyId, score, totalPossibleScore, 
                    startDate, endDate);
            System.out.println("GameAttemptController: Successfully saved attempt with ID: " + attempt.getAttemptId());
            return ResponseEntity.status(HttpStatus.CREATED).body(attempt);
        } catch (Exception e) {
            System.err.println("GameAttemptController: Error saving game attempt: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/complete-game")
    @Operation(summary = "Complete a game and save attempt with progress cleanup", 
               description = "Records a completed game attempt and automatically deletes the associated progress to save data")
    public ResponseEntity<GameAttemptDTO> completeGameAndSaveAttempt(
            @Parameter(description = "User ID") @RequestParam Long userId,
            @Parameter(description = "Story ID") @RequestParam Integer storyId,
            @Parameter(description = "Score achieved") @RequestParam Integer score,
            @Parameter(description = "Total possible score") @RequestParam Integer totalPossibleScore,
            @Parameter(description = "Start attempt date (ISO format)") 
            @RequestParam String startAttemptDate,
            @Parameter(description = "End attempt date (ISO format)") 
            @RequestParam String endAttemptDate) {
        
        System.out.println("GameAttemptController: Received request to complete game and save attempt");
        System.out.println("Parameters: userId=" + userId + ", storyId=" + storyId + ", score=" + score + 
                          ", totalPossibleScore=" + totalPossibleScore + ", startDate=" + startAttemptDate + 
                          ", endDate=" + endAttemptDate);
        
        try {
            // Parse the ISO date strings to LocalDateTime
            // Handle both with and without timezone (Z) suffix
            String startDateStr = startAttemptDate.endsWith("Z") ? 
                startAttemptDate.substring(0, startAttemptDate.length() - 1) : startAttemptDate;
            String endDateStr = endAttemptDate.endsWith("Z") ? 
                endAttemptDate.substring(0, endAttemptDate.length() - 1) : endAttemptDate;
            
            LocalDateTime startDate = LocalDateTime.parse(startDateStr);
            LocalDateTime endDate = LocalDateTime.parse(endDateStr);
            
            GameAttemptDTO attempt = gameAttemptService.saveGameAttemptAndCleanupProgress(
                    userId, storyId, score, totalPossibleScore, 
                    startDate, endDate);
            System.out.println("GameAttemptController: Successfully completed game and saved attempt with ID: " + attempt.getAttemptId());
            return ResponseEntity.status(HttpStatus.CREATED).body(attempt);
        } catch (Exception e) {
            System.err.println("GameAttemptController: Error completing game and saving attempt: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all attempts for a user", 
               description = "Retrieves the complete match history for a user")
    public ResponseEntity<List<GameAttemptDTO>> getUserAttempts(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        
        List<GameAttemptDTO> attempts = gameAttemptService.getUserAttempts(userId);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/user/{userId}/paginated")
    @Operation(summary = "Get paginated attempts for a user", 
               description = "Retrieves paginated match history for a user")
    public ResponseEntity<Page<GameAttemptDTO>> getUserAttemptsPaginated(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        
        Page<GameAttemptDTO> attempts = gameAttemptService.getUserAttemptsPaginated(userId, page, size);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/user/{userId}/story/{storyId}")
    @Operation(summary = "Get attempts for a specific story", 
               description = "Retrieves all attempts for a user on a specific story")
    public ResponseEntity<List<GameAttemptDTO>> getUserAttemptsForStory(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Story ID") @PathVariable Integer storyId) {
        
        List<GameAttemptDTO> attempts = gameAttemptService.getUserAttemptsForStory(userId, storyId);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/user/{userId}/story/{storyId}/best")
    @Operation(summary = "Get best attempt for a story", 
               description = "Retrieves the highest scoring attempt for a user on a specific story")
    public ResponseEntity<GameAttemptDTO> getBestAttemptForStory(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Story ID") @PathVariable Integer storyId) {
        
        Optional<GameAttemptDTO> attempt = gameAttemptService.getBestAttemptForStory(userId, storyId);
        return attempt.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}/story/{storyId}/latest")
    @Operation(summary = "Get latest attempt for a story", 
               description = "Retrieves the most recent attempt for a user on a specific story")
    public ResponseEntity<GameAttemptDTO> getLatestAttemptForStory(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Story ID") @PathVariable Integer storyId) {
        
        Optional<GameAttemptDTO> attempt = gameAttemptService.getLatestAttemptForStory(userId, storyId);
        return attempt.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}/statistics")
    @Operation(summary = "Get user attempt statistics", 
               description = "Retrieves overall statistics for a user's attempts")
    public ResponseEntity<GameAttemptService.AttemptStatisticsDTO> getUserStatistics(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        
        GameAttemptService.AttemptStatisticsDTO stats = gameAttemptService.getUserStatistics(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user/{userId}/story/{storyId}/statistics")
    @Operation(summary = "Get user statistics for a specific story", 
               description = "Retrieves statistics for a user's attempts on a specific story")
    public ResponseEntity<GameAttemptService.AttemptStatisticsDTO> getUserStatisticsForStory(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Story ID") @PathVariable Integer storyId) {
        
        GameAttemptService.AttemptStatisticsDTO stats = gameAttemptService.getUserStatisticsForStory(userId, storyId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user/{userId}/date-range")
    @Operation(summary = "Get attempts within date range", 
               description = "Retrieves attempts for a user within a specific date range")
    public ResponseEntity<List<GameAttemptDTO>> getAttemptsInDateRange(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Start date (ISO format)") 
            @RequestParam String startDate,
            @Parameter(description = "End date (ISO format)") 
            @RequestParam String endDate) {
        
        try {
            // Handle both with and without timezone (Z) suffix
            String startDateStr = startDate.endsWith("Z") ? 
                startDate.substring(0, startDate.length() - 1) : startDate;
            String endDateStr = endDate.endsWith("Z") ? 
                endDate.substring(0, endDate.length() - 1) : endDate;
            
            LocalDateTime startDateTime = LocalDateTime.parse(startDateStr);
            LocalDateTime endDateTime = LocalDateTime.parse(endDateStr);
            List<GameAttemptDTO> attempts = gameAttemptService.getAttemptsInDateRange(userId, startDateTime, endDateTime);
            return ResponseEntity.ok(attempts);
        } catch (Exception e) {
            System.err.println("GameAttemptController: Error parsing dates: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/user/{userId}/score-above")
    @Operation(summary = "Get attempts above score threshold", 
               description = "Retrieves attempts for a user with score above a specified threshold")
    public ResponseEntity<List<GameAttemptDTO>> getAttemptsAboveScore(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Minimum score threshold") @RequestParam Integer minScore) {
        
        List<GameAttemptDTO> attempts = gameAttemptService.getAttemptsAboveScore(userId, minScore);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/test/user/{userId}")
    @Operation(summary = "Test endpoint to verify attempts are being recorded", 
               description = "Returns all attempts for a user to verify the system is working")
    public ResponseEntity<List<GameAttemptDTO>> testUserAttempts(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        
        List<GameAttemptDTO> attempts = gameAttemptService.getUserAttempts(userId);
        System.out.println("Test endpoint: Found " + attempts.size() + " attempts for user " + userId);
        return ResponseEntity.ok(attempts);
    }
}
