package JIZAS.BrightMinds;

import JIZAS.BrightMinds.dto.GameAttemptDTO;
import JIZAS.BrightMinds.entity.Progress;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.entity.Story;
import JIZAS.BrightMinds.repository.ProgressRepository;
import JIZAS.BrightMinds.service.GameAttemptService;
import JIZAS.BrightMinds.service.ProgressService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class GameAttemptProgressCleanupTest {

    @Autowired
    private GameAttemptService gameAttemptService;

    @Autowired
    private ProgressService progressService;

    @Autowired
    private ProgressRepository progressRepository;

    @Test
    public void testSaveGameAttemptAndCleanupProgress() {
        // Arrange
        Long userId = 1L;
        Integer storyId = 1;
        Integer score = 85;
        Integer totalPossibleScore = 100;
        LocalDateTime startTime = LocalDateTime.now().minusHours(1);
        LocalDateTime endTime = LocalDateTime.now();

        // Create a test progress record first
        Progress testProgress = new Progress();
        User user = new User();
        user.setUserId(userId);
        testProgress.setUser(user);
        
        Story story = new Story();
        story.setStoryId(storyId);
        testProgress.setStory(story);
        
        testProgress.setCurrentScene("scene_1");
        testProgress.setScore(score);
        testProgress.setLastAccessed(LocalDateTime.now());
        
        // Save the progress
        progressRepository.save(testProgress);
        
        // Verify progress exists before the test
        Optional<Progress> progressBefore = progressRepository.findByUserAndStory(userId, storyId);
        assertTrue(progressBefore.isPresent(), "Progress should exist before game completion");

        // Act - Save game attempt and cleanup progress
        GameAttemptDTO result = gameAttemptService.saveGameAttemptAndCleanupProgress(
                userId, storyId, score, totalPossibleScore, startTime, endTime);

        // Assert
        assertNotNull(result, "Game attempt should be saved successfully");
        assertEquals(userId, result.getUserId(), "User ID should match");
        assertEquals(storyId, result.getStoryId(), "Story ID should match");
        assertEquals(score, result.getScore(), "Score should match");
        assertEquals(totalPossibleScore, result.getTotalPossibleScore(), "Total possible score should match");

        // Verify progress is deleted after game completion
        Optional<Progress> progressAfter = progressRepository.findByUserAndStory(userId, storyId);
        assertFalse(progressAfter.isPresent(), "Progress should be deleted after game completion");
    }

    @Test
    public void testSaveGameAttemptDeletesProgress() {
        // Arrange
        Long userId = 2L;
        Integer storyId = 2;
        Integer score = 70;
        Integer totalPossibleScore = 100;
        LocalDateTime startTime = LocalDateTime.now().minusMinutes(30);
        LocalDateTime endTime = LocalDateTime.now();

        // Create a test progress record first
        Progress testProgress = new Progress();
        User user = new User();
        user.setUserId(userId);
        testProgress.setUser(user);
        
        Story story = new Story();
        story.setStoryId(storyId);
        testProgress.setStory(story);
        
        testProgress.setCurrentScene("scene_2");
        testProgress.setScore(score);
        testProgress.setLastAccessed(LocalDateTime.now());
        
        // Save the progress
        progressRepository.save(testProgress);
        
        // Verify progress exists before the test
        Optional<Progress> progressBefore = progressRepository.findByUserAndStory(userId, storyId);
        assertTrue(progressBefore.isPresent(), "Progress should exist before game completion");

        // Act - Save game attempt (this should also delete progress now)
        GameAttemptDTO result = gameAttemptService.saveGameAttempt(
                userId, storyId, score, totalPossibleScore, startTime, endTime);

        // Assert
        assertNotNull(result, "Game attempt should be saved successfully");
        assertEquals(userId, result.getUserId(), "User ID should match");
        assertEquals(storyId, result.getStoryId(), "Story ID should match");

        // Verify progress is deleted after game completion
        Optional<Progress> progressAfter = progressRepository.findByUserAndStory(userId, storyId);
        assertFalse(progressAfter.isPresent(), "Progress should be deleted after game completion");
    }
}
