package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.*;
import JIZAS.BrightMinds.entity.Progress;
import JIZAS.BrightMinds.entity.Story;
import JIZAS.BrightMinds.entity.Scene;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.entity.UserResponse;
import JIZAS.BrightMinds.repository.ProgressRepository;
import JIZAS.BrightMinds.repository.UserRepository;
import JIZAS.BrightMinds.repository.SceneRepository;
import JIZAS.BrightMinds.repository.UserResponseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProgressService {

    private final ProgressRepository repo;
    private final UserRepository userRepo;
    private final SceneRepository sceneRepo;
    private final UserResponseRepository userResponseRepo;

    public ProgressService(ProgressRepository repo, UserRepository userRepo, 
                          SceneRepository sceneRepo, UserResponseRepository userResponseRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.sceneRepo = sceneRepo;
        this.userResponseRepo = userResponseRepo;
    }

    public ProgressViewDTO create(ProgressRequestDTO req) {
        // Check if progress already exists for this user and story
        Optional<Progress> existingProgress = repo.findByUserAndStory(req.getUserId(), req.getStoryId());
        
        if (existingProgress.isPresent()) {
            // Update existing progress instead of creating new one
            Progress p = existingProgress.get();
            p.setCurrentScene(req.getCurrentScene());
            p.setScore(req.getScore());
            p.setPerQuestionState(req.getPerQuestionState());
            p.setLastAccessed(LocalDateTime.now());
            return toView(repo.save(p));
        }

        // Create new progress
        Progress p = new Progress();

        // Optional.ifPresent to satisfy the null-check warning
        userRepo.findById(req.getUserId()).ifPresent(p::setUser);
        if (p.getUser() == null) return null;

        Story s = new Story();
        s.setStoryId(req.getStoryId());
        p.setStory(s);

        p.setCurrentScene(req.getCurrentScene());
        p.setScore(req.getScore());
        p.setPerQuestionState(req.getPerQuestionState());
        p.setLastAccessed(LocalDateTime.now());

        return toView(repo.save(p));
    }

    public ProgressViewDTO get(Long id) {
        return repo.findById(id).map(this::toView).orElse(null);
    }

    public List<ProgressViewDTO> list() {
        return repo.findAll().stream().map(this::toView).collect(Collectors.toList());
    }

    public ProgressViewDTO update(Long id, ProgressRequestDTO req) {
        Progress p = repo.findById(id).orElse(null);
        if (p == null) return null;

        if (req.getUserId() != null) {
            userRepo.findById(req.getUserId()).ifPresent(p::setUser);
        }
        if (req.getStoryId() != null) {
            Story s = new Story();
            s.setStoryId(req.getStoryId());
            p.setStory(s);
        }

        p.setCurrentScene(req.getCurrentScene());
        p.setScore(req.getScore());
        p.setPerQuestionState(req.getPerQuestionState());
        p.setLastAccessed(LocalDateTime.now());

        return toView(repo.save(p));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<ProgressViewDTO> getByUserId(Long userId) {
        return repo.findByUser_UserId(userId).stream().map(this::toView).collect(Collectors.toList());
    }

    public List<ProgressViewDTO> getByStoryId(Integer storyId) {
        return repo.findByStory_StoryId(storyId).stream().map(this::toView).collect(Collectors.toList());
    }

    /**
     * Get progress for a specific user and story combination
     */
    public ProgressViewDTO getByUserAndStory(Long userId, Integer storyId) {
        return repo.findByUserAndStory(userId, storyId).map(this::toView).orElse(null);
    }

    /**
     * Start a new attempt - deletes any existing progress for the user-story combination
     * and creates a fresh progress record
     */
    public ProgressViewDTO startNewAttempt(ProgressRequestDTO req) {
        // Delete any existing progress for this user-story combination
        deleteByUserAndStory(req.getUserId(), req.getStoryId());
        
        // Create new progress
        return create(req);
    }

    /**
     * Continue existing progress - updates the existing progress or creates new if none exists
     */
    public ProgressViewDTO continueProgress(ProgressRequestDTO req) {
        return create(req); // This will update existing or create new
    }

    /**
     * Delete progress by user and story combination
     */
    public void deleteByUserAndStory(Long userId, Integer storyId) {
        repo.findByUserAndStory(userId, storyId).ifPresent(progress -> {
            repo.delete(progress);
        });
    }

    /**
     * Delete progress after game completion
     * This should be called after a game attempt is recorded
     */
    public void deleteProgressAfterCompletion(Long userId, Integer storyId) {
        deleteByUserAndStory(userId, storyId);
    }

    /**
     * Check if user has existing progress for a story
     */
    public GameProgressDTO checkExistingProgress(Long userId, Integer storyId) {
        GameProgressDTO gameProgress = new GameProgressDTO();
        gameProgress.setUserId(userId);
        gameProgress.setStoryId(storyId);
        
        Optional<Progress> existingProgress = repo.findByUserAndStory(userId, storyId);
        
        if (existingProgress.isPresent()) {
            Progress progress = existingProgress.get();
            gameProgress.setHasExistingProgress(true);
            
            // Return the current scene from progress (where user actually is)
            if (progress.getCurrentScene() != null) {
                gameProgress.setCurrentSceneId(Integer.parseInt(progress.getCurrentScene()));
                
                // Get scene order if scene ID exists
                Optional<Scene> scene = sceneRepo.findById(gameProgress.getCurrentSceneId());
                scene.ifPresent(s -> gameProgress.setCurrentSceneOrder(s.getSceneOrder()));
            } else {
                // If no current scene, start from the first scene
                List<Scene> allScenes = sceneRepo.findByStoryStoryIdOrderBySceneOrder(storyId);
                if (!allScenes.isEmpty()) {
                    Scene firstScene = allScenes.get(0);
                    gameProgress.setCurrentSceneId(firstScene.getSceneId());
                    gameProgress.setCurrentSceneOrder(firstScene.getSceneOrder());
                }
            }
            
            gameProgress.setScore(progress.getScore());
            gameProgress.setLastAccessed(progress.getLastAccessed());
            gameProgress.setMistakeCount(progress.getMistakeCount());
            gameProgress.setAnswerStates(progress.getAnswerStates());
            gameProgress.setPerQuestionState(progress.getPerQuestionState());
            gameProgress.setQuestionMistakes(progress.getQuestionMistakes());
        } else {
            gameProgress.setHasExistingProgress(false);
            gameProgress.setScore(0);
        }
        
        return gameProgress;
    }

    /**
     * Save progress after user moves to a new scene
     */
    public ProgressViewDTO saveProgressAfterScene(SaveProgressDTO saveProgressDTO) {
        // Get or create progress for this user-story combination
        Optional<Progress> existingProgress = repo.findByUserAndStory(
            saveProgressDTO.getUserId(), saveProgressDTO.getStoryId());
        
        Progress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
        } else {
            // Create new progress
            progress = new Progress();
            userRepo.findById(saveProgressDTO.getUserId()).ifPresent(progress::setUser);
            if (progress.getUser() == null) return null;
            
            Story story = new Story();
            story.setStoryId(saveProgressDTO.getStoryId());
            progress.setStory(story);
            progress.setScore(0);
        }
        
        // Update progress with new scene information
        progress.setCurrentScene(saveProgressDTO.getSceneId().toString());
        progress.setLastAccessed(LocalDateTime.now());
        
        // Update game start time if provided
        if (saveProgressDTO.getGameStartTime() != null) {
            progress.setGameStartTime(saveProgressDTO.getGameStartTime());
        }
        
        // Update mistake count if provided
        if (saveProgressDTO.getMistakeCount() != null) {
            progress.setMistakeCount(saveProgressDTO.getMistakeCount());
        }
        
        // Update answer states if provided
        if (saveProgressDTO.getAnswerStates() != null) {
            progress.setAnswerStates(saveProgressDTO.getAnswerStates());
        }
        
        // Update score if provided
        if (saveProgressDTO.getPointsEarned() != null) {
            int currentScore = progress.getScore() != null ? progress.getScore() : 0;
            int newScore = currentScore + saveProgressDTO.getPointsEarned();
            progress.setScore(newScore);
        }
        
        // Update per-question state if provided
        if (saveProgressDTO.getPerQuestionState() != null) {
            progress.setPerQuestionState(saveProgressDTO.getPerQuestionState());
        }
        
        // Update question mistakes if provided
        if (saveProgressDTO.getQuestionMistakes() != null) {
            progress.setQuestionMistakes(saveProgressDTO.getQuestionMistakes());
        }
        
        return toView(repo.save(progress));
    }

    /**
     * Save wrong answer state immediately when user selects wrong answer
     */
    public ProgressViewDTO saveWrongAnswerState(SaveProgressDTO saveProgressDTO) {
        System.out.println("ProgressService: Saving wrong answer state for user " + saveProgressDTO.getUserId() + 
                          ", story " + saveProgressDTO.getStoryId() + ", scene " + saveProgressDTO.getSceneId());
        
        Optional<Progress> existingProgress = repo.findByUserAndStory(
                saveProgressDTO.getUserId(), saveProgressDTO.getStoryId());

        Progress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            System.out.println("ProgressService: Found existing progress, updating wrong answer state");
        } else {
            // Create new progress if none exists
            progress = new Progress();
            User user = new User();
            user.setUserId(saveProgressDTO.getUserId());
            progress.setUser(user);
            
            Story story = new Story();
            story.setStoryId(saveProgressDTO.getStoryId());
            progress.setStory(story);
            progress.setScore(0);
            progress.setMistakeCount(0);
            System.out.println("ProgressService: Created new progress for wrong answer state");
        }
        
        // Update current scene
        progress.setCurrentScene(saveProgressDTO.getSceneId().toString());
        progress.setLastAccessed(LocalDateTime.now());
        
        // Update game start time if provided
        if (saveProgressDTO.getGameStartTime() != null) {
            progress.setGameStartTime(saveProgressDTO.getGameStartTime());
        }
        
        // Update mistake count (increment by 1 for wrong answer)
        int currentMistakeCount = progress.getMistakeCount() != null ? progress.getMistakeCount() : 0;
        progress.setMistakeCount(currentMistakeCount + 1);
        
        // Update answer states with wrong answer
        if (saveProgressDTO.getAnswerStates() != null) {
            progress.setAnswerStates(saveProgressDTO.getAnswerStates());
            System.out.println("ProgressService: Updated answer states: " + saveProgressDTO.getAnswerStates());
        }
        
        // Update per-question state if provided
        if (saveProgressDTO.getPerQuestionState() != null) {
            progress.setPerQuestionState(saveProgressDTO.getPerQuestionState());
        }
        
        // Update question mistakes if provided
        if (saveProgressDTO.getQuestionMistakes() != null) {
            progress.setQuestionMistakes(saveProgressDTO.getQuestionMistakes());
        }
        
        Progress savedProgress = repo.save(progress);
        System.out.println("ProgressService: Wrong answer state saved successfully");
        return toView(savedProgress);
    }

    /**
     * Save progress after user answers a question (deprecated - use saveProgressAfterScene instead)
     */
    public ProgressViewDTO saveProgressAfterAnswer(SaveProgressDTO saveProgressDTO) {
        // Redirect to scene-based progress saving
        return saveProgressAfterScene(saveProgressDTO);
    }

    /**
     * Get next scene for user based on current progress
     */
    public Integer getNextSceneId(Long userId, Integer storyId) {
        Optional<Progress> progressOpt = repo.findByUserAndStory(userId, storyId);
        
        if (progressOpt.isPresent()) {
            Progress progress = progressOpt.get();
            if (progress.getCurrentScene() != null) {
                Integer currentSceneId = Integer.parseInt(progress.getCurrentScene());
                Optional<Scene> currentScene = sceneRepo.findById(currentSceneId);
                
                if (currentScene.isPresent()) {
                    // Get next scene in the story
                    List<Scene> allScenes = sceneRepo.findByStoryStoryIdOrderBySceneOrder(storyId);
                    int currentIndex = -1;
                    
                    for (int i = 0; i < allScenes.size(); i++) {
                        if (allScenes.get(i).getSceneId().equals(currentSceneId)) {
                            currentIndex = i;
                            break;
                        }
                    }
                    
                    // Return next scene ID if exists
                    if (currentIndex >= 0 && currentIndex < allScenes.size() - 1) {
                        return allScenes.get(currentIndex + 1).getSceneId();
                    }
                }
            }
        }
        
        // Return first scene if no progress or at the end
        List<Scene> allScenes = sceneRepo.findByStoryStoryIdOrderBySceneOrder(storyId);
        return allScenes.isEmpty() ? null : allScenes.get(0).getSceneId();
    }

    /**
     * Get the next available scene for user (not completed)
     * This method ensures users can't reattempt completed questions
     */
    public Integer getNextAvailableSceneId(Long userId, Integer storyId) {
        Optional<Progress> progressOpt = repo.findByUserAndStory(userId, storyId);
        
        if (progressOpt.isPresent()) {
            Progress progress = progressOpt.get();
            Map<String, Object> perQuestionState = progress.getPerQuestionState();
            
            if (perQuestionState != null && !perQuestionState.isEmpty()) {
                // Get all scenes for this story
                List<Scene> allScenes = sceneRepo.findByStoryStoryIdOrderBySceneOrder(storyId);
                
                // Find the first scene that doesn't have a completed question
                for (Scene scene : allScenes) {
                    // Try both sceneId and sceneOrder as keys
                    String sceneKeyById = "scene_" + scene.getSceneId();
                    String sceneKeyByOrder = "scene_" + scene.getSceneOrder();
                    Object sceneState = perQuestionState.get(sceneKeyById);
                    
                    // If not found by sceneId, try sceneOrder
                    if (sceneState == null) {
                        sceneState = perQuestionState.get(sceneKeyByOrder);
                    }
                    
                    // If scene state exists and indicates completion, skip it
                    if (sceneState instanceof Map<?, ?>) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> sceneStateMap = (Map<String, Object>) sceneState;
                        Boolean isCompleted = (Boolean) sceneStateMap.get("completed");
                        if (Boolean.TRUE.equals(isCompleted)) {
                            continue; // Skip completed scenes
                        }
                    }
                    
                    // Return the first non-completed scene (prefer sceneId, fallback to sceneOrder)
                    return scene.getSceneId() != null ? scene.getSceneId() : scene.getSceneOrder();
                }
                
                // If all scenes are completed, return the last scene
                Scene lastScene = allScenes.isEmpty() ? null : allScenes.get(allScenes.size() - 1);
                return lastScene != null ? (lastScene.getSceneId() != null ? lastScene.getSceneId() : lastScene.getSceneOrder()) : null;
            }
        }
        
        // Return first scene if no progress or no question state
        List<Scene> allScenes = sceneRepo.findByStoryStoryIdOrderBySceneOrder(storyId);
        Scene firstScene = allScenes.isEmpty() ? null : allScenes.get(0);
        return firstScene != null ? (firstScene.getSceneId() != null ? firstScene.getSceneId() : firstScene.getSceneOrder()) : null;
    }

    private ProgressViewDTO toView(Progress p) {
        ProgressViewDTO v = new ProgressViewDTO();
        v.setProgressId(p.getProgressId());
        v.setUserId(p.getUser().getUserId());
        v.setStoryId(p.getStory().getStoryId());
        v.setCurrentScene(p.getCurrentScene());
        v.setScore(p.getScore());
        v.setLastAccessed(p.getLastAccessed());
        v.setPerQuestionState(p.getPerQuestionState());
        return v;
    }
}
