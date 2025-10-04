package JIZAS.BrightMinds;

import JIZAS.BrightMinds.dto.GameProgressDTO;
import JIZAS.BrightMinds.dto.SaveProgressDTO;
import JIZAS.BrightMinds.entity.*;
import JIZAS.BrightMinds.repository.*;
import JIZAS.BrightMinds.service.ProgressService;
import JIZAS.BrightMinds.service.UserResponseService;
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
public class AutoSaveProgressTest {

    @Autowired
    private ProgressService progressService;

    @Autowired
    private UserResponseService userResponseService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private SceneRepository sceneRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserResponseRepository userResponseRepository;

    private User testUser;
    private Story testStory;
    private Scene testScene;
    private Question testQuestion;

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
        testStory.setStoryOrder(1);
        testStory = storyRepository.save(testStory);

        // Create test scene
        testScene = new Scene();
        testScene.setStory(testStory);
        testScene.setSceneOrder(1);
        testScene.setSceneText("Test Scene");
        testScene = sceneRepository.save(testScene);

        // Create test question
        testQuestion = new Question();
        testQuestion.setSceneId(testScene.getSceneId());
        testQuestion.setPromptText("What is a mountain?");
        testQuestion.setType(Question.QuestionType.MCQ);
        testQuestion.setPoints(4);
        testQuestion = questionRepository.save(testQuestion);
    }

    @Test
    void testCheckExistingProgress_NoProgress() {
        // Test checking progress when none exists
        GameProgressDTO progress = progressService.checkExistingProgress(testUser.getUserId(), testStory.getStoryId());
        
        assertNotNull(progress);
        assertEquals(testUser.getUserId(), progress.getUserId());
        assertEquals(testStory.getStoryId(), progress.getStoryId());
        assertFalse(progress.isHasExistingProgress());
        assertEquals(0, progress.getScore());
    }

    @Test
    void testSaveProgressAfterAnswer() {
        // Test saving progress after answering a question
        SaveProgressDTO saveProgressDTO = new SaveProgressDTO();
        saveProgressDTO.setUserId(testUser.getUserId());
        saveProgressDTO.setStoryId(testStory.getStoryId());
        saveProgressDTO.setSceneId(testScene.getSceneId());
        saveProgressDTO.setQuestionId(testQuestion.getQuestionId());
        saveProgressDTO.setGivenAnswer("Bundok");
        saveProgressDTO.setCorrect(true);
        saveProgressDTO.setPointsEarned(4);
        
        Map<String, Object> questionState = new HashMap<>();
        questionState.put("question1", "answered");
        saveProgressDTO.setPerQuestionState(questionState);

        var result = progressService.saveProgressAfterAnswer(saveProgressDTO);
        
        assertNotNull(result);
        assertEquals(testUser.getUserId(), result.getUserId());
        assertEquals(testStory.getStoryId(), result.getStoryId());
        assertEquals(testScene.getSceneId().toString(), result.getCurrentScene());
        assertEquals(4, result.getScore());
        assertNotNull(result.getPerQuestionState());
    }

    @Test
    void testCheckExistingProgress_WithProgress() {
        // First save some progress
        SaveProgressDTO saveProgressDTO = new SaveProgressDTO();
        saveProgressDTO.setUserId(testUser.getUserId());
        saveProgressDTO.setStoryId(testStory.getStoryId());
        saveProgressDTO.setSceneId(testScene.getSceneId());
        saveProgressDTO.setQuestionId(testQuestion.getQuestionId());
        saveProgressDTO.setGivenAnswer("Bundok");
        saveProgressDTO.setCorrect(true);
        saveProgressDTO.setPointsEarned(4);
        
        progressService.saveProgressAfterAnswer(saveProgressDTO);

        // Now check for existing progress
        GameProgressDTO progress = progressService.checkExistingProgress(testUser.getUserId(), testStory.getStoryId());
        
        assertNotNull(progress);
        assertTrue(progress.isHasExistingProgress());
        assertEquals(testScene.getSceneId(), progress.getCurrentSceneId());
        assertEquals(1, progress.getCurrentSceneOrder());
        assertEquals(4, progress.getScore());
    }

    @Test
    void testGetNextSceneId() {
        // Save progress for current scene
        SaveProgressDTO saveProgressDTO = new SaveProgressDTO();
        saveProgressDTO.setUserId(testUser.getUserId());
        saveProgressDTO.setStoryId(testStory.getStoryId());
        saveProgressDTO.setSceneId(testScene.getSceneId());
        saveProgressDTO.setQuestionId(testQuestion.getQuestionId());
        saveProgressDTO.setGivenAnswer("Bundok");
        saveProgressDTO.setCorrect(true);
        saveProgressDTO.setPointsEarned(4);
        
        progressService.saveProgressAfterAnswer(saveProgressDTO);

        // Create next scene
        Scene nextScene = new Scene();
        nextScene.setStory(testStory);
        nextScene.setSceneOrder(2);
        nextScene.setSceneText("Next Scene");
        nextScene = sceneRepository.save(nextScene);

        // Get next scene ID
        Integer nextSceneId = progressService.getNextSceneId(testUser.getUserId(), testStory.getStoryId());
        
        assertNotNull(nextSceneId);
        assertEquals(nextScene.getSceneId(), nextSceneId);
    }

    @Test
    void testDeleteByUserAndStory() {
        // First save some progress
        SaveProgressDTO saveProgressDTO = new SaveProgressDTO();
        saveProgressDTO.setUserId(testUser.getUserId());
        saveProgressDTO.setStoryId(testStory.getStoryId());
        saveProgressDTO.setSceneId(testScene.getSceneId());
        saveProgressDTO.setQuestionId(testQuestion.getQuestionId());
        saveProgressDTO.setGivenAnswer("Bundok");
        saveProgressDTO.setCorrect(true);
        saveProgressDTO.setPointsEarned(4);
        
        progressService.saveProgressAfterAnswer(saveProgressDTO);

        // Verify progress exists
        GameProgressDTO progress = progressService.checkExistingProgress(testUser.getUserId(), testStory.getStoryId());
        assertTrue(progress.isHasExistingProgress());

        // Delete progress
        progressService.deleteByUserAndStory(testUser.getUserId(), testStory.getStoryId());

        // Verify progress is deleted
        GameProgressDTO deletedProgress = progressService.checkExistingProgress(testUser.getUserId(), testStory.getStoryId());
        assertFalse(deletedProgress.isHasExistingProgress());
    }

    @Test
    void testProgressUpdateOnMultipleAnswers() {
        // Answer first question
        SaveProgressDTO saveProgressDTO1 = new SaveProgressDTO();
        saveProgressDTO1.setUserId(testUser.getUserId());
        saveProgressDTO1.setStoryId(testStory.getStoryId());
        saveProgressDTO1.setSceneId(testScene.getSceneId());
        saveProgressDTO1.setQuestionId(testQuestion.getQuestionId());
        saveProgressDTO1.setGivenAnswer("Bundok");
        saveProgressDTO1.setCorrect(true);
        saveProgressDTO1.setPointsEarned(4);
        
        var result1 = progressService.saveProgressAfterAnswer(saveProgressDTO1);
        assertEquals(4, result1.getScore());

        // Create second scene and question
        Scene scene2 = new Scene();
        scene2.setStory(testStory);
        scene2.setSceneOrder(2);
        scene2.setSceneText("Scene 2");
        scene2 = sceneRepository.save(scene2);

        Question question2 = new Question();
        question2.setSceneId(scene2.getSceneId());
        question2.setPromptText("What is a valley?");
        question2.setType(Question.QuestionType.MCQ);
        question2.setPoints(4);
        question2 = questionRepository.save(question2);

        // Answer second question
        SaveProgressDTO saveProgressDTO2 = new SaveProgressDTO();
        saveProgressDTO2.setUserId(testUser.getUserId());
        saveProgressDTO2.setStoryId(testStory.getStoryId());
        saveProgressDTO2.setSceneId(scene2.getSceneId());
        saveProgressDTO2.setQuestionId(question2.getQuestionId());
        saveProgressDTO2.setGivenAnswer("Lambak");
        saveProgressDTO2.setCorrect(true);
        saveProgressDTO2.setPointsEarned(4);
        
        var result2 = progressService.saveProgressAfterAnswer(saveProgressDTO2);
        
        // Should update existing progress, not create new one
        assertEquals(result1.getProgressId(), result2.getProgressId());
        assertEquals(8, result2.getScore()); // 4 + 4
        assertEquals(scene2.getSceneId().toString(), result2.getCurrentScene());
    }
}
