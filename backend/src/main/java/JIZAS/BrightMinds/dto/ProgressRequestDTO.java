package JIZAS.BrightMinds.dto;

import java.util.Map;

public class ProgressRequestDTO {
    private Long userId;
    private Integer storyId;
    private String currentScene;
    private Integer score;
    private Map<String, Object> perQuestionState;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getStoryId() { return storyId; }
    public void setStoryId(Integer storyId) { this.storyId = storyId; }

    public String getCurrentScene() { return currentScene; }
    public void setCurrentScene(String currentScene) { this.currentScene = currentScene; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Map<String, Object> getPerQuestionState() { return perQuestionState; }
    public void setPerQuestionState(Map<String, Object> perQuestionState) { this.perQuestionState = perQuestionState; }
}
