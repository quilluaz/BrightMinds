package JIZAS.BrightMinds.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class GameProgressDTO {
    private Long userId;
    private Integer storyId;
    private Integer currentSceneId;
    private Integer currentSceneOrder;
    private Integer score;
    private LocalDateTime lastAccessed;
    private Integer mistakeCount;
    private Map<String, Object> answerStates;
    private Map<String, Object> perQuestionState;
    private Map<String, Object> questionMistakes;
    private boolean hasExistingProgress;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getStoryId() { return storyId; }
    public void setStoryId(Integer storyId) { this.storyId = storyId; }

    public Integer getCurrentSceneId() { return currentSceneId; }
    public void setCurrentSceneId(Integer currentSceneId) { this.currentSceneId = currentSceneId; }

    public Integer getCurrentSceneOrder() { return currentSceneOrder; }
    public void setCurrentSceneOrder(Integer currentSceneOrder) { this.currentSceneOrder = currentSceneOrder; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getLastAccessed() { return lastAccessed; }
    public void setLastAccessed(LocalDateTime lastAccessed) { this.lastAccessed = lastAccessed; }

    public Integer getMistakeCount() { return mistakeCount; }
    public void setMistakeCount(Integer mistakeCount) { this.mistakeCount = mistakeCount; }

    public Map<String, Object> getAnswerStates() { return answerStates; }
    public void setAnswerStates(Map<String, Object> answerStates) { this.answerStates = answerStates; }

    public Map<String, Object> getPerQuestionState() { return perQuestionState; }
    public void setPerQuestionState(Map<String, Object> perQuestionState) { this.perQuestionState = perQuestionState; }

    public Map<String, Object> getQuestionMistakes() { return questionMistakes; }
    public void setQuestionMistakes(Map<String, Object> questionMistakes) { this.questionMistakes = questionMistakes; }

    public boolean isHasExistingProgress() { return hasExistingProgress; }
    public void setHasExistingProgress(boolean hasExistingProgress) { this.hasExistingProgress = hasExistingProgress; }
}
