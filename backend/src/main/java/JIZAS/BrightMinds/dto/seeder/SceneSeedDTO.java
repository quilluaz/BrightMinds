package JIZAS.BrightMinds.dto.seeder;

import java.util.List;

public class SceneSeedDTO {
    private int sceneOrder;
    private String sceneText;
    private List<AssetSeedDTO> assets;
    private List<DialogueSeedDTO> dialogues;
    private QuestionSeedDTO question;

    // Getters and Setters
    public int getSceneOrder() { return sceneOrder; }
    public void setSceneOrder(int sceneOrder) { this.sceneOrder = sceneOrder; }
    public String getSceneText() { return sceneText; }
    public void setSceneText(String sceneText) { this.sceneText = sceneText; }
    public List<AssetSeedDTO> getAssets() { return assets; }
    public void setAssets(List<AssetSeedDTO> assets) { this.assets = assets; }
    public List<DialogueSeedDTO> getDialogues() { return dialogues; }
    public void setDialogues(List<DialogueSeedDTO> dialogues) { this.dialogues = dialogues; }
    public QuestionSeedDTO getQuestion() { return question; }
    public void setQuestion(QuestionSeedDTO question) { this.question = question; }
}