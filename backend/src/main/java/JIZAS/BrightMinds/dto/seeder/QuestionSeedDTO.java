package JIZAS.BrightMinds.dto.seeder;

import java.util.List;

public class QuestionSeedDTO {
    private String type;
    private String promptText;
    private int points;
    private List<ChoiceSeedDTO> choices;

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPromptText() { return promptText; }
    public void setPromptText(String promptText) { this.promptText = promptText; }
    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
    public List<ChoiceSeedDTO> getChoices() { return choices; }
    public void setChoices(List<ChoiceSeedDTO> choices) { this.choices = choices; }
}