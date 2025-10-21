package JIZAS.BrightMinds.dto.seeder;

public class AnswerSeedDTO {
    private String answerText;
    private String assetName;
    private Boolean isCorrect;
    private Integer dragdropPosition;

    // Constructors
    public AnswerSeedDTO() {}

    public AnswerSeedDTO(String answerText, String assetName, Boolean isCorrect, Integer dragdropPosition) {
        this.answerText = answerText;
        this.assetName = assetName;
        this.isCorrect = isCorrect;
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
