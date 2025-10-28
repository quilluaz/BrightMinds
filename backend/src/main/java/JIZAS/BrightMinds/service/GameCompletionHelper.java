package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.GameAttemptDTO;
import JIZAS.BrightMinds.entity.Progress;
import JIZAS.BrightMinds.entity.UserResponse;
import JIZAS.BrightMinds.repository.ProgressRepository;
import JIZAS.BrightMinds.repository.UserResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Helper service to handle game completion and attempt recording
 * This service bridges the gap between the existing Progress system and the new GameAttempt system
 */
@Service
@Transactional
public class GameCompletionHelper {

    @Autowired
    private GameAttemptService gameAttemptService;

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserResponseRepository userResponseRepository;

    @Autowired
    private ProgressService progressService;

    /**
     * Record a game attempt when a user completes a story
     * This method should be called when a user finishes a story/game
     * 
     * @param userId The ID of the user who completed the game
     * @param storyId The ID of the story that was completed
     * @param startTime The time when the user started the game
     * @param endTime The time when the user completed the game
     * @return The recorded game attempt
     */
    public GameAttemptDTO recordGameCompletion(Long userId, Integer storyId, LocalDateTime startTime, LocalDateTime endTime) {
        // Get the user's progress for this story
        Progress progress = progressRepository.findByUserAndStory(userId, storyId)
                .orElseThrow(() -> new RuntimeException("Progress not found for user " + userId + " and story " + storyId));
        
        int totalScore = progress.getScore() != null ? progress.getScore() : 0;
        
        // Calculate total possible score (assuming each question has equal weight)
        // You might want to adjust this based on your scoring system
        List<UserResponse> responses = userResponseRepository.findByUserAndStory(userId, storyId);
        int totalQuestions = responses.size();
        int totalPossibleScore = totalQuestions * 10; // Assuming 10 points per question

        // Record the attempt
        GameAttemptDTO attempt = gameAttemptService.saveGameAttempt(
                userId,
                storyId,
                totalScore,
                totalPossibleScore,
                startTime,
                endTime
        );

        // Delete the progress after successful completion recording
        progressService.deleteProgressAfterCompletion(userId, storyId);

        return attempt;
    }

    /**
     * Record a game attempt with custom scoring
     * Use this method if you have custom scoring logic
     * 
     * @param userId The ID of the user who completed the game
     * @param storyId The ID of the story that was completed
     * @param score The score achieved
     * @param totalPossibleScore The maximum possible score
     * @param startTime The time when the user started the game
     * @return The recorded game attempt
     */
    public GameAttemptDTO recordGameCompletionWithCustomScore(Long userId, Integer storyId, 
                                                             Integer score, Integer totalPossibleScore, 
                                                             LocalDateTime startTime, LocalDateTime endTime) {
        // Record the attempt
        GameAttemptDTO attempt = gameAttemptService.saveGameAttempt(
                userId,
                storyId,
                score,
                totalPossibleScore,
                startTime,
                endTime
        );

        // Delete the progress after successful completion recording
        progressService.deleteProgressAfterCompletion(userId, storyId);

        return attempt;
    }
}
