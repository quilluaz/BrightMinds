package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.Question;
import java.util.List;
import java.util.stream.Collectors;

public class QuestionDTO {
    private Integer questionId;
    private Integer sceneId;
    private String type;
    private String promptText;
    private String questionImageUrl;
    private Integer points;
    private List<ChoiceDTO> choices;
    private List<AnswerDTO> answers;
    
    // Constructors
    public QuestionDTO() {}
    
    public QuestionDTO(Question question) {
        this.questionId = question.getQuestionId();
        this.sceneId = question.getSceneId();
        this.type = question.getType() != null ? question.getType().name() : null;
        this.promptText = question.getPromptText();
        this.questionImageUrl = question.getQuestionImageUrl();
        this.points = question.getPoints();
        
        // Convert choices to DTOs
        if (question.getChoices() != null) {
            this.choices = question.getChoices().stream()
                    .map(ChoiceDTO::new)
                    .collect(Collectors.toList());
        }
        
        // Convert answers to DTOs
        if (question.getAnswers() != null) {
            this.answers = question.getAnswers().stream()
                    .map(AnswerDTO::new)
                    .collect(Collectors.toList());
        }
    }
    
    // Convert DTO to Entity
    public Question toEntity() {
        Question question = new Question();
        question.setQuestionId(this.questionId);
        question.setSceneId(this.sceneId);
        if (this.type != null) {
            question.setType(Question.QuestionType.valueOf(this.type));
        }
        question.setPromptText(this.promptText);
        question.setQuestionImageUrl(this.questionImageUrl);
        question.setPoints(this.points);
        return question;
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
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
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
    
    public List<ChoiceDTO> getChoices() {
        return choices;
    }
    
    public void setChoices(List<ChoiceDTO> choices) {
        this.choices = choices;
    }
    
    public List<AnswerDTO> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }
}
