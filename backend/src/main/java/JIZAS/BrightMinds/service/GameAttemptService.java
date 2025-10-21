package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.GameAttemptDTO;
import JIZAS.BrightMinds.entity.GameAttempt;
import JIZAS.BrightMinds.entity.Story;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.repository.GameAttemptRepository;
import JIZAS.BrightMinds.repository.StoryRepository;
import JIZAS.BrightMinds.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class GameAttemptService {

    @Autowired
    private GameAttemptRepository gameAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private ProgressService progressService;

    @Autowired
    private BadgeAwardService badgeAwardService;

    /**
     * Save a new game attempt
     */
    public GameAttemptDTO saveGameAttempt(Long userId, Integer storyId, Integer score, 
                                        Integer totalPossibleScore, LocalDateTime startAttemptDate,
                                        LocalDateTime endAttemptDate) {
        
        System.out.println("GameAttemptService: Starting to save game attempt");
        System.out.println("Input parameters: userId=" + userId + ", storyId=" + storyId + ", score=" + score + 
                          ", totalPossibleScore=" + totalPossibleScore + ", startDate=" + startAttemptDate + 
                          ", endDate=" + endAttemptDate);
        
        // Validate user and story exist
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        System.out.println("GameAttemptService: Found user: " + user.getUserId());
        
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found with id: " + storyId));
        System.out.println("GameAttemptService: Found story: " + story.getStoryId());

        // Calculate percentage
        Double percentage = totalPossibleScore > 0 ? (double) score / totalPossibleScore * 100 : 0.0;
        System.out.println("GameAttemptService: Calculated percentage: " + percentage);

        // Calculate completion time
        Integer completionTimeSeconds = null;
        if (startAttemptDate != null && endAttemptDate != null) {
            completionTimeSeconds = (int) java.time.Duration.between(startAttemptDate, endAttemptDate).getSeconds();
            System.out.println("GameAttemptService: Calculated completion time: " + completionTimeSeconds + " seconds");
        }

        // Create and save the attempt
        GameAttempt attempt = new GameAttempt();
        attempt.setUser(user);
        attempt.setStory(story);
        attempt.setScore(score);
        attempt.setTotalPossibleScore(totalPossibleScore);
        attempt.setPercentage(percentage);
        attempt.setStartAttemptDate(startAttemptDate);
        attempt.setEndAttemptDate(endAttemptDate);
        attempt.setCompletionTimeSeconds(completionTimeSeconds);

        System.out.println("GameAttemptService: Attempting to save to database...");
        GameAttempt savedAttempt = gameAttemptRepository.save(attempt);
        System.out.println("GameAttemptService: Successfully saved attempt with ID: " + savedAttempt.getAttemptId());
        
        // Award badges based on performance
        System.out.println("GameAttemptService: Checking for badge awards...");
        badgeAwardService.awardBadgesForGameCompletion(user, story, score, totalPossibleScore, percentage);
        
        // Delete the progress after successful game attempt storage to save data
        System.out.println("GameAttemptService: Deleting progress for user " + userId + " and story " + storyId);
        progressService.deleteProgressAfterCompletion(userId, storyId);
        System.out.println("GameAttemptService: Progress deleted successfully");
        
        GameAttemptDTO dto = convertToDTO(savedAttempt);
        System.out.println("GameAttemptService: Converted to DTO: " + dto.getAttemptId());
        return dto;
    }

    /**
     * Save a game attempt and automatically delete the associated progress to save data
     * This method is specifically designed for when a user completes a game
     */
    public GameAttemptDTO saveGameAttemptAndCleanupProgress(Long userId, Integer storyId, Integer score, 
                                                           Integer totalPossibleScore, LocalDateTime startAttemptDate,
                                                           LocalDateTime endAttemptDate) {
        System.out.println("GameAttemptService: Saving game attempt and cleaning up progress");
        
        // Save the game attempt (this will also delete the progress)
        GameAttemptDTO attempt = saveGameAttempt(userId, storyId, score, totalPossibleScore, startAttemptDate, endAttemptDate);
        
        System.out.println("GameAttemptService: Game attempt saved and progress cleaned up successfully");
        return attempt;
    }

    /**
     * Get all attempts for a user (match history)
     */
    public List<GameAttemptDTO> getUserAttempts(Long userId) {
        System.out.println("GameAttemptService: Getting attempts for user: " + userId);
        List<GameAttempt> attempts = gameAttemptRepository.findByUserUserIdOrderByEndAttemptDateDesc(userId);
        System.out.println("GameAttemptService: Found " + attempts.size() + " attempts in database");
        List<GameAttemptDTO> dtos = attempts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        System.out.println("GameAttemptService: Converted to " + dtos.size() + " DTOs");
        return dtos;
    }

    /**
     * Get paginated attempts for a user
     */
    public Page<GameAttemptDTO> getUserAttemptsPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GameAttempt> attempts = gameAttemptRepository.findByUserUserIdOrderByEndAttemptDateDesc(userId, pageable);
        return attempts.map(this::convertToDTO);
    }

    /**
     * Get attempts for a specific story by a user
     */
    public List<GameAttemptDTO> getUserAttemptsForStory(Long userId, Integer storyId) {
        List<GameAttempt> attempts = gameAttemptRepository.findByUserUserIdAndStoryStoryIdOrderByEndAttemptDateDesc(userId, storyId);
        return attempts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get the best attempt for a specific story by a user
     */
    public Optional<GameAttemptDTO> getBestAttemptForStory(Long userId, Integer storyId) {
        List<GameAttempt> attempts = gameAttemptRepository.findBestAttemptByUserAndStory(userId, storyId);
        return attempts.stream()
                .findFirst()
                .map(this::convertToDTO);
    }

    /**
     * Get the latest attempt for a specific story by a user
     */
    public Optional<GameAttemptDTO> getLatestAttemptForStory(Long userId, Integer storyId) {
        List<GameAttempt> attempts = gameAttemptRepository.findLatestAttemptByUserAndStory(userId, storyId);
        return attempts.stream()
                .findFirst()
                .map(this::convertToDTO);
    }

    /**
     * Get attempt statistics for a user
     */
    public AttemptStatisticsDTO getUserStatistics(Long userId) {
        long totalAttempts = gameAttemptRepository.countByUserUserId(userId);
        Double averageScore = gameAttemptRepository.findAverageScoreByUser(userId);
        
        return new AttemptStatisticsDTO(totalAttempts, averageScore != null ? averageScore : 0.0);
    }

    /**
     * Get attempt statistics for a user for a specific story
     */
    public AttemptStatisticsDTO getUserStatisticsForStory(Long userId, Integer storyId) {
        long totalAttempts = gameAttemptRepository.countByUserUserIdAndStoryStoryId(userId, storyId);
        Double averageScore = gameAttemptRepository.findAverageScoreByUserAndStory(userId, storyId);
        
        return new AttemptStatisticsDTO(totalAttempts, averageScore != null ? averageScore : 0.0);
    }

    /**
     * Get attempts within a date range
     */
    public List<GameAttemptDTO> getAttemptsInDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<GameAttempt> attempts = gameAttemptRepository.findByUserUserIdAndEndAttemptDateBetweenOrderByEndAttemptDateDesc(
                userId, startDate, endDate);
        return attempts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get attempts with score above threshold
     */
    public List<GameAttemptDTO> getAttemptsAboveScore(Long userId, Integer minScore) {
        List<GameAttempt> attempts = gameAttemptRepository.findByUserUserIdAndScoreGreaterThanEqualOrderByEndAttemptDateDesc(userId, minScore);
        return attempts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert GameAttempt entity to DTO
     */
    private GameAttemptDTO convertToDTO(GameAttempt attempt) {
        GameAttemptDTO dto = new GameAttemptDTO();
        dto.setAttemptId(attempt.getAttemptId());
        dto.setUserId(attempt.getUser().getUserId());
        dto.setStoryId(attempt.getStory().getStoryId());
        dto.setStoryTitle(attempt.getStory().getTitle());
        dto.setScore(attempt.getScore());
        dto.setTotalPossibleScore(attempt.getTotalPossibleScore());
        dto.setPercentage(attempt.getPercentage());
        dto.setStartAttemptDate(attempt.getStartAttemptDate());
        dto.setEndAttemptDate(attempt.getEndAttemptDate());
        dto.setCompletionTimeSeconds(attempt.getCompletionTimeSeconds());
        return dto;
    }

    /**
     * Inner class for attempt statistics
     */
    public static class AttemptStatisticsDTO {
        private long totalAttempts;
        private double averageScore;

        public AttemptStatisticsDTO(long totalAttempts, double averageScore) {
            this.totalAttempts = totalAttempts;
            this.averageScore = averageScore;
        }

        public long getTotalAttempts() {
            return totalAttempts;
        }

        public void setTotalAttempts(long totalAttempts) {
            this.totalAttempts = totalAttempts;
        }

        public double getAverageScore() {
            return averageScore;
        }

        public void setAverageScore(double averageScore) {
            this.averageScore = averageScore;
        }
    }

}
