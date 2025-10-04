package JIZAS.BrightMinds.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class SaveProgressDTO {
    private Long userId;
    private Integer storyId;
    private Integer sceneId;
    private Integer questionId;
    private String givenAnswer;
    private boolean isCorrect;
    private Integer pointsEarned;
    private LocalDateTime gameStartTime;
    private Integer mistakeCount;
    private Map<String, Object> answerStates;
    private Map<String, Object> perQuestionState;
    private Map<String, Object> questionMistakes;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getStoryId() { return storyId; }
    public void setStoryId(Integer storyId) { this.storyId = storyId; }

    public Integer getSceneId() { return sceneId; }
    public void setSceneId(Integer sceneId) { this.sceneId = sceneId; }

    public Integer getQuestionId() { return questionId; }
    public void setQuestionId(Integer questionId) { this.questionId = questionId; }

    public String getGivenAnswer() { return givenAnswer; }
    public void setGivenAnswer(String givenAnswer) { this.givenAnswer = givenAnswer; }

    public boolean isCorrect() { return isCorrect; }
    public void setCorrect(boolean correct) { isCorrect = correct; }

    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }

    public LocalDateTime getGameStartTime() { return gameStartTime; }
    public void setGameStartTime(LocalDateTime gameStartTime) { this.gameStartTime = gameStartTime; }

    public Integer getMistakeCount() { return mistakeCount; }
    public void setMistakeCount(Integer mistakeCount) { this.mistakeCount = mistakeCount; }

    public Map<String, Object> getAnswerStates() { return answerStates; }
    public void setAnswerStates(Map<String, Object> answerStates) { this.answerStates = answerStates; }

    public Map<String, Object> getPerQuestionState() { return perQuestionState; }
    public void setPerQuestionState(Map<String, Object> perQuestionState) { this.perQuestionState = perQuestionState; }

    public Map<String, Object> getQuestionMistakes() { return questionMistakes; }
    public void setQuestionMistakes(Map<String, Object> questionMistakes) { this.questionMistakes = questionMistakes; }
}
