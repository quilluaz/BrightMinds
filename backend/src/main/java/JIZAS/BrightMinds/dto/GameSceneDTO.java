package JIZAS.BrightMinds.dto;

import java.util.List;

public class GameSceneDTO {

    private SceneDTO scene;
    private List<DialogueDTO> dialogues;
    private List<SceneAssetDTO> assets;
    private QuestionDTO question;

    // Getters and Setters
    public SceneDTO getScene() { return scene; }
    public void setScene(SceneDTO scene) { this.scene = scene; }
    public List<DialogueDTO> getDialogues() { return dialogues; }
    public void setDialogues(List<DialogueDTO> dialogues) { this.dialogues = dialogues; }
    public List<SceneAssetDTO> getAssets() { return assets; }
    public void setAssets(List<SceneAssetDTO> assets) { this.assets = assets; }
    public QuestionDTO getQuestion() { return question; }
    public void setQuestion(QuestionDTO question) { this.question = question; }
}