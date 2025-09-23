package JIZAS.BrightMinds.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ProgressViewDTO {
    private Long progressId;
    private Long userId;
    private Integer storyId;
    private String currentScene;
    private Integer score;
    private LocalDateTime lastAccessed;
    private Map<String, Object> perQuestionState;

    public Long getProgressId() { return progressId; }
    public void setProgressId(Long progressId) { this.progressId = progressId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getStoryId() { return storyId; }
    public void setStoryId(Integer storyId) { this.storyId = storyId; }

    public String getCurrentScene() { return currentScene; }
    public void setCurrentScene(String currentScene) { this.currentScene = currentScene; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getLastAccessed() { return lastAccessed; }
    public void setLastAccessed(LocalDateTime lastAccessed) { this.lastAccessed = lastAccessed; }
    public Map<String, Object> getPerQuestionState() { return perQuestionState; }
    public void setPerQuestionState(Map<String, Object> perQuestionState) { this.perQuestionState = perQuestionState; }
}
