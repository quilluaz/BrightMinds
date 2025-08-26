package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer questionId;
    
    @Column(name = "scene_id")
    private Integer sceneId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private QuestionType type;
    
    @Column(name = "prompt_text", columnDefinition = "TEXT")
    private String promptText;
    
    @Column(name = "question_image_url")
    private String questionImageUrl;
    
    @Column(name = "points")
    private Integer points;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Choice> choices;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Answer> answers;
    
    // Constructors
    public Question() {}
    
    public Question(Integer sceneId, QuestionType type, String promptText, String questionImageUrl, Integer points) {
        this.sceneId = sceneId;
        this.type = type;
        this.promptText = promptText;
        this.questionImageUrl = questionImageUrl;
        this.points = points;
    }
    
    // Getters and Setters
    public Integer getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }
    
    public Integer getSceneId() {
        return sceneId;
    }
    
    public void setSceneId(Integer sceneId) {
        this.sceneId = sceneId;
    }
    
    public QuestionType getType() {
        return type;
    }
    
    public void setType(QuestionType type) {
        this.type = type;
    }
    
    public String getPromptText() {
        return promptText;
    }
    
    public void setPromptText(String promptText) {
        this.promptText = promptText;
    }
    
    public String getQuestionImageUrl() {
        return questionImageUrl;
    }
    
    public void setQuestionImageUrl(String questionImageUrl) {
        this.questionImageUrl = questionImageUrl;
    }
    
    public Integer getPoints() {
        return points;
    }
    
    public void setPoints(Integer points) {
        this.points = points;
    }
    
    public List<Choice> getChoices() {
        return choices;
    }
    
    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }
    
    public List<Answer> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }
    
    // QuestionType enum
    public enum QuestionType {
        MCQ, DragDog, ID
    }
}
