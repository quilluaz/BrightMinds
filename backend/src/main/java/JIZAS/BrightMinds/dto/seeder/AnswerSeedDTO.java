package JIZAS.BrightMinds.dto.seeder;

public class AnswerSeedDTO {
    private String answerText;
    private Integer dragdropPosition;

    // Constructors
    public AnswerSeedDTO() {}

    public AnswerSeedDTO(String answerText, Integer dragdropPosition) {
        this.answerText = answerText;
        this.dragdropPosition = dragdropPosition;
    }

    // Getters and Setters
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
