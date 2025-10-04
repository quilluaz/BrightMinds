package JIZAS.BrightMinds;

import JIZAS.BrightMinds.dto.ProgressRequestDTO;
import JIZAS.BrightMinds.dto.ProgressViewDTO;
import JIZAS.BrightMinds.entity.Progress;
import JIZAS.BrightMinds.entity.Story;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.repository.ProgressRepository;
import JIZAS.BrightMinds.repository.StoryRepository;
import JIZAS.BrightMinds.repository.UserRepository;
import JIZAS.BrightMinds.service.ProgressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ProgressFunctionalityTest {

    @Autowired
    private ProgressService progressService;

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoryRepository storyRepository;

    private User testUser;
    private Story testStory;
    private ProgressRequestDTO progressRequest;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setFName("Test");
        testUser.setLName("User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password");
        testUser = userRepository.save(testUser);

        // Create test story
        testStory = new Story();
        testStory.setTitle("Test Story");
        testStory.setDescription("Test Description");
        testStory = storyRepository.save(testStory);

        // Create progress request
        progressRequest = new ProgressRequestDTO();
        progressRequest.setUserId(testUser.getUserId());
        progressRequest.setStoryId(testStory.getStoryId());
        progressRequest.setCurrentScene("scene1");
        progressRequest.setScore(10);
        
        Map<String, Object> questionState = new HashMap<>();
        questionState.put("question1", "answered");
        progressRequest.setPerQuestionState(questionState);
    }

    @Test
    void testCreateProgress() {
        // Test creating new progress
        ProgressViewDTO result = progressService.create(progressRequest);
        
        assertNotNull(result);
        assertEquals(testUser.getUserId(), result.getUserId());
        assertEquals(testStory.getStoryId(), result.getStoryId());
        assertEquals("scene1", result.getCurrentScene());
        assertEquals(10, result.getScore());
        assertNotNull(result.getPerQuestionState());
    }

    @Test
    void testDuplicatePrevention() {
        // Create first progress
        ProgressViewDTO firstProgress = progressService.create(progressRequest);
        assertNotNull(firstProgress);

        // Try to create another progress for same user-story combination
        progressRequest.setCurrentScene("scene2");
        progressRequest.setScore(20);
        ProgressViewDTO secondProgress = progressService.create(progressRequest);

        // Should update existing progress, not create new one
        assertNotNull(secondProgress);
        assertEquals(firstProgress.getProgressId(), secondProgress.getProgressId());
        assertEquals("scene2", secondProgress.getCurrentScene());
        assertEquals(20, secondProgress.getScore());

        // Verify only one progress record exists
        long count = progressRepository.findByUser_UserId(testUser.getUserId()).size();
        assertEquals(1, count);
    }

    @Test
    void testStartNewAttempt() {
        // Create initial progress
        ProgressViewDTO initialProgress = progressService.create(progressRequest);
        assertNotNull(initialProgress);

        // Start new attempt
        progressRequest.setCurrentScene("scene3");
        progressRequest.setScore(0);
        ProgressViewDTO newProgress = progressService.startNewAttempt(progressRequest);

        // Should create new progress with different ID
        assertNotNull(newProgress);
        assertNotEquals(initialProgress.getProgressId(), newProgress.getProgressId());
        assertEquals("scene3", newProgress.getCurrentScene());
        assertEquals(0, newProgress.getScore());

        // Verify only one progress record exists (old one should be deleted)
        long count = progressRepository.findByUser_UserId(testUser.getUserId()).size();
        assertEquals(1, count);
    }

    @Test
    void testContinueProgress() {
        // Create initial progress
        ProgressViewDTO initialProgress = progressService.create(progressRequest);
        assertNotNull(initialProgress);

        // Continue progress
        progressRequest.setCurrentScene("scene4");
        progressRequest.setScore(30);
        ProgressViewDTO continuedProgress = progressService.continueProgress(progressRequest);

        // Should update existing progress
        assertNotNull(continuedProgress);
        assertEquals(initialProgress.getProgressId(), continuedProgress.getProgressId());
        assertEquals("scene4", continuedProgress.getCurrentScene());
        assertEquals(30, continuedProgress.getScore());

        // Verify only one progress record exists
        long count = progressRepository.findByUser_UserId(testUser.getUserId()).size();
        assertEquals(1, count);
    }

    @Test
    void testGetByUserAndStory() {
        // Create progress
        ProgressViewDTO createdProgress = progressService.create(progressRequest);
        assertNotNull(createdProgress);

        // Get progress by user and story
        ProgressViewDTO retrievedProgress = progressService.getByUserAndStory(
            testUser.getUserId(), testStory.getStoryId());

        assertNotNull(retrievedProgress);
        assertEquals(createdProgress.getProgressId(), retrievedProgress.getProgressId());
        assertEquals(testUser.getUserId(), retrievedProgress.getUserId());
        assertEquals(testStory.getStoryId(), retrievedProgress.getStoryId());
    }

    @Test
    void testDeleteByUserAndStory() {
        // Create progress
        ProgressViewDTO createdProgress = progressService.create(progressRequest);
        assertNotNull(createdProgress);

        // Delete progress
        progressService.deleteByUserAndStory(testUser.getUserId(), testStory.getStoryId());

        // Verify progress is deleted
        ProgressViewDTO deletedProgress = progressService.getByUserAndStory(
            testUser.getUserId(), testStory.getStoryId());
        assertNull(deletedProgress);
    }

    @Test
    void testDeleteProgressAfterCompletion() {
        // Create progress
        ProgressViewDTO createdProgress = progressService.create(progressRequest);
        assertNotNull(createdProgress);

        // Delete progress after completion
        progressService.deleteProgressAfterCompletion(testUser.getUserId(), testStory.getStoryId());

        // Verify progress is deleted
        ProgressViewDTO deletedProgress = progressService.getByUserAndStory(
            testUser.getUserId(), testStory.getStoryId());
        assertNull(deletedProgress);
    }
}
