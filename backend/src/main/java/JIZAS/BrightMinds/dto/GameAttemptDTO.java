package JIZAS.BrightMinds.dto;

import java.time.LocalDateTime;

public class GameAttemptDTO {
    private Long attemptId;
    private Long userId;
    private Integer storyId;
    private String storyTitle;
    private Integer score;
    private Integer totalPossibleScore;
    private Double percentage;
    private LocalDateTime startAttemptDate;
    private LocalDateTime endAttemptDate;
    private Integer completionTimeSeconds;

    public GameAttemptDTO() {}

    public GameAttemptDTO(Long attemptId, Long userId, Integer storyId, String storyTitle,
                         Integer score, Integer totalPossibleScore, Double percentage,
                         LocalDateTime startAttemptDate, LocalDateTime endAttemptDate) {
        this.attemptId = attemptId;
        this.userId = userId;
        this.storyId = storyId;
        this.storyTitle = storyTitle;
        this.score = score;
        this.totalPossibleScore = totalPossibleScore;
        this.percentage = percentage;
        this.startAttemptDate = startAttemptDate;
        this.endAttemptDate = endAttemptDate;
    }

    // Getters and Setters
    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getStoryId() {
        return storyId;
    }

    public void setStoryId(Integer storyId) {
        this.storyId = storyId;
    }

    public String getStoryTitle() {
        return storyTitle;
    }

    public void setStoryTitle(String storyTitle) {
        this.storyTitle = storyTitle;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalPossibleScore() {
        return totalPossibleScore;
    }

    public void setTotalPossibleScore(Integer totalPossibleScore) {
        this.totalPossibleScore = totalPossibleScore;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public LocalDateTime getStartAttemptDate() {
        return startAttemptDate;
    }

    public void setStartAttemptDate(LocalDateTime startAttemptDate) {
        this.startAttemptDate = startAttemptDate;
    }

    public LocalDateTime getEndAttemptDate() {
        return endAttemptDate;
    }

    public void setEndAttemptDate(LocalDateTime endAttemptDate) {
        this.endAttemptDate = endAttemptDate;
    }

    public Integer getCompletionTimeSeconds() {
        return completionTimeSeconds;
    }

    public void setCompletionTimeSeconds(Integer completionTimeSeconds) {
        this.completionTimeSeconds = completionTimeSeconds;
    }
}
