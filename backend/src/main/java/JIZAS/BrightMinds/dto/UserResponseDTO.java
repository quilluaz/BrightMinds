package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.UserResponse;
import java.time.LocalDateTime;

public class UserResponseDTO {
    private Long responseId;
    private Long userId;
    private Integer questionId;
    private String givenAnswer;
    private Boolean isCorrect;
    private LocalDateTime submittedAt;

    public UserResponseDTO() {}

    public UserResponseDTO(UserResponse entity) {
        this.responseId = entity.getResponseId();
        this.userId = entity.getUser() != null ? entity.getUser().getUserId() : null;
        this.questionId = entity.getQuestion() != null ? entity.getQuestion().getQuestionId() : null;
        this.givenAnswer = entity.getGivenAnswer();
        this.isCorrect = entity.getIsCorrect();
        this.submittedAt = entity.getSubmittedAt();
    }

    public Long getResponseId() { return responseId; }
    public void setResponseId(Long responseId) { this.responseId = responseId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getQuestionId() { return questionId; }
    public void setQuestionId(Integer questionId) { this.questionId = questionId; }

    public String getGivenAnswer() { return givenAnswer; }
    public void setGivenAnswer(String givenAnswer) { this.givenAnswer = givenAnswer; }

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}


