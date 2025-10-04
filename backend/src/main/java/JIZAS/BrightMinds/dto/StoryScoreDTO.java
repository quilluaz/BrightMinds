package JIZAS.BrightMinds.dto;

public class StoryScoreDTO {
    private Integer storyId;
    private String storyTitle;
    private Integer totalQuestions;
    private Integer totalPossiblePoints;
    private Integer earnedPoints;
    private Double percentage;
    private Integer wrongAttempts;

    public StoryScoreDTO() {}

    public StoryScoreDTO(Integer storyId, String storyTitle, Integer totalQuestions, 
                        Integer totalPossiblePoints, Integer earnedPoints, 
                        Double percentage, Integer wrongAttempts) {
        this.storyId = storyId;
        this.storyTitle = storyTitle;
        this.totalQuestions = totalQuestions;
        this.totalPossiblePoints = totalPossiblePoints;
        this.earnedPoints = earnedPoints;
        this.percentage = percentage;
        this.wrongAttempts = wrongAttempts;
    }

    // Getters and Setters
    public Integer getStoryId() { return storyId; }
    public void setStoryId(Integer storyId) { this.storyId = storyId; }

    public String getStoryTitle() { return storyTitle; }
    public void setStoryTitle(String storyTitle) { this.storyTitle = storyTitle; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getTotalPossiblePoints() { return totalPossiblePoints; }
    public void setTotalPossiblePoints(Integer totalPossiblePoints) { this.totalPossiblePoints = totalPossiblePoints; }

    public Integer getEarnedPoints() { return earnedPoints; }
    public void setEarnedPoints(Integer earnedPoints) { this.earnedPoints = earnedPoints; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public Integer getWrongAttempts() { return wrongAttempts; }
    public void setWrongAttempts(Integer wrongAttempts) { this.wrongAttempts = wrongAttempts; }
}

