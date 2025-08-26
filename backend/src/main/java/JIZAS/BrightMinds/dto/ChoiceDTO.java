package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.Choice;

public class ChoiceDTO {
    private Integer choiceId;
    private Integer questionId;
    private String choiceText;
    private Boolean isCorrect;
    private String choiceImageUrl;
    
    // Constructors
    public ChoiceDTO() {}
    
    public ChoiceDTO(Choice choice) {
        this.choiceId = choice.getChoiceId();
        this.questionId = choice.getQuestion() != null ? choice.getQuestion().getQuestionId() : null;
        this.choiceText = choice.getChoiceText();
        this.isCorrect = choice.getIsCorrect();
        this.choiceImageUrl = choice.getChoiceImageUrl();
    }
    
    // Convert DTO to Entity
    public Choice toEntity() {
        Choice choice = new Choice();
        choice.setChoiceId(this.choiceId);
        choice.setChoiceText(this.choiceText);
        choice.setIsCorrect(this.isCorrect);
        choice.setChoiceImageUrl(this.choiceImageUrl);
        return choice;
    }
    
    // Getters and Setters
    public Integer getChoiceId() {
        return choiceId;
    }
    
    public void setChoiceId(Integer choiceId) {
        this.choiceId = choiceId;
    }
    
    public Integer getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
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
