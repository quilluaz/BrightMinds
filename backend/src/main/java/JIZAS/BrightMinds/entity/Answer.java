package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "answers")
public class Answer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Integer answerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
    
    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;
    
    @Column(name = "dragdrop_position")
    private Integer dragdropPosition;
    
    // Constructors
    public Answer() {}
    
    public Answer(Question question, String answerText, Integer dragdropPosition) {
        this.question = question;
        this.answerText = answerText;
        this.dragdropPosition = dragdropPosition;
    }
    
    public Answer(Question question, String answerText) {
        this.question = question;
        this.answerText = answerText;
        this.dragdropPosition = null;
    }
    
    // Getters and Setters
    public Integer getAnswerId() {
        return answerId;
    }
    
    public void setAnswerId(Integer answerId) {
        this.answerId = answerId;
    }
    
    public Question getQuestion() {
        return question;
    }
    
    public void setQuestion(Question question) {
        this.question = question;
    }
    
    public String getAnswerText() {
        return answerText;
    }
    
    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }
    
    public Integer getDragdropPosition() {
        return dragdropPosition;
    }
    
    public void setDragdropPosition(Integer dragdropPosition) {
        this.dragdropPosition = dragdropPosition;
    }
}
