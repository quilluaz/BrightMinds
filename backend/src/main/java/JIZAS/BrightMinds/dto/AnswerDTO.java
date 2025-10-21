package JIZAS.BrightMinds.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import JIZAS.BrightMinds.entity.Answer;

public class AnswerDTO {
    private Integer answerId;
    private Integer questionId;
    private String answerText;
    private String assetName;
    
    @JsonProperty("isCorrect")
    private Boolean isCorrect;
    
    private Integer dragdropPosition;
    
    // Constructors
    public AnswerDTO() {}
    
    public AnswerDTO(Answer answer) {
        this.answerId = answer.getAnswerId();
        this.questionId = answer.getQuestion() != null ? answer.getQuestion().getQuestionId() : null;
        this.answerText = answer.getAnswerText();
        this.assetName = answer.getAssetName();
        this.isCorrect = answer.isCorrect();
        this.dragdropPosition = answer.getDragdropPosition();
    }
    
    // Convert DTO to Entity
    public Answer toEntity() {
        Answer answer = new Answer();
        answer.setAnswerId(this.answerId);
        answer.setAnswerText(this.answerText);
        answer.setDragdropPosition(this.dragdropPosition);
        return answer;
    }
    
    // Getters and Setters
    public Integer getAnswerId() {
        return answerId;
    }
    
    public void setAnswerId(Integer answerId) {
        this.answerId = answerId;
    }
    
    public Integer getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
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
    
    public String getAssetName() {
        return assetName;
    }
    
    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }
    
    public Boolean isCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}
