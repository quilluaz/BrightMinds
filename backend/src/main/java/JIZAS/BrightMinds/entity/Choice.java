package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "choices")
public class Choice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "choice_id")
    private Integer choiceId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
    
    @Column(name = "choice_text", columnDefinition = "TEXT")
    private String choiceText;
    
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    @Column(name = "choice_image_url")
    private String choiceImageUrl;
    
    // Constructors
    public Choice() {}
    
    public Choice(Question question, String choiceText, Boolean isCorrect, String choiceImageUrl) {
        this.question = question;
        this.choiceText = choiceText;
        this.isCorrect = isCorrect;
        this.choiceImageUrl = choiceImageUrl;
    }
    
    // Getters and Setters
    public Integer getChoiceId() {
        return choiceId;
    }
    
    public void setChoiceId(Integer choiceId) {
        this.choiceId = choiceId;
    }
    
    public Question getQuestion() {
        return question;
    }
    
    public void setQuestion(Question question) {
        this.question = question;
    }
    
    public String getChoiceText() {
        return choiceText;
    }
    
    public void setChoiceText(String choiceText) {
        this.choiceText = choiceText;
    }
    
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    
    public String getChoiceImageUrl() {
        return choiceImageUrl;
    }
    
    public void setChoiceImageUrl(String choiceImageUrl) {
        this.choiceImageUrl = choiceImageUrl;
    }
}
