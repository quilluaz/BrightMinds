package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_attempts")
public class GameAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_id")
    private Long attemptId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "story_id", nullable = false)
    @NotNull(message = "Story is required")
    private Story story;

    @Column(name = "score", nullable = false)
    @NotNull(message = "Score is required")
    private Integer score;

    @Column(name = "total_possible_score", nullable = false)
    @NotNull(message = "Total possible score is required")
    private Integer totalPossibleScore;

    @Column(name = "percentage", nullable = false)
    @NotNull(message = "Percentage is required")
    private Double percentage;

    @Column(name = "start_attempt_date", nullable = false)
    @NotNull(message = "Start attempt date is required")
    private LocalDateTime startAttemptDate;

    @Column(name = "end_attempt_date", nullable = false)
    @NotNull(message = "End attempt date is required")
    private LocalDateTime endAttemptDate;

    @Column(name = "completion_time_seconds")
    private Integer completionTimeSeconds;

    public GameAttempt() {}

    public GameAttempt(User user, Story story, Integer score, Integer totalPossibleScore, 
                      Double percentage, LocalDateTime startAttemptDate, LocalDateTime endAttemptDate) {
        this.user = user;
        this.story = story;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Story getStory() {
        return story;
    }

    public void setStory(Story story) {
        this.story = story;
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
