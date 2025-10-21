package JIZAS.BrightMinds.dto.seeder;

public class AnswerSeedDTO {
    private String answerText;
    private String assetName;  // Used for linking to assets in drag-drop games (not stored in DB)
    private Boolean isCorrect;  // Used for drag-drop games (not stored in DB)
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

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getDragdropPosition() {
        return dragdropPosition;
    }

    public void setDragdropPosition(Integer dragdropPosition) {
        this.dragdropPosition = dragdropPosition;
    }
}
