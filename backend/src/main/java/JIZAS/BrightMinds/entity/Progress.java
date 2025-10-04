package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "Progress")
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progress_id")
    private Long progressId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @Column(name = "current_scene")
    private String currentScene;

    @Column(name = "score")
    private Integer score;

    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;

    @Column(name = "game_start_time")
    private LocalDateTime gameStartTime;

    @Column(name = "mistake_count")
    private Integer mistakeCount;

    @Column(name = "answer_states", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> answerStates;

    @Column(name = "per_question_state", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> perQuestionState;

    @Column(name = "question_mistakes", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> questionMistakes;

    public Progress() {}

    public Long getProgressId() { return progressId; }
    public void setProgressId(Long progressId) { this.progressId = progressId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Story getStory() { return story; }
    public void setStory(Story story) { this.story = story; }

    public String getCurrentScene() { return currentScene; }
    public void setCurrentScene(String currentScene) { this.currentScene = currentScene; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getLastAccessed() { return lastAccessed; }
    public void setLastAccessed(LocalDateTime lastAccessed) { this.lastAccessed = lastAccessed; }

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