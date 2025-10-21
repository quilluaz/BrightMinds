package JIZAS.BrightMinds.dto.seeder;

public class ChoiceSeedDTO {
    private String choiceText;
    private boolean isCorrect;
    private String choiceImageUrl;

    // Getters and Setters
    public String getChoiceText() {
        return choiceText;
    }

    public void setChoiceText(String choiceText) {
        this.choiceText = choiceText;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(boolean correct) {
        isCorrect = correct;
    }

    public String getChoiceImageUrl() {
        return choiceImageUrl;
    }

    public void setChoiceImageUrl(String choiceImageUrl) {
        this.choiceImageUrl = choiceImageUrl;
    }
}