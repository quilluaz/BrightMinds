package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.Asset;
import JIZAS.BrightMinds.entity.Dialogue;
import JIZAS.BrightMinds.entity.Scene;
import java.util.Map;
import java.util.UUID;

public class DialogueDTO {
    private UUID dialogueId;
    private Integer sceneId;
    private String characterName;
    private String lineText;
    private Long voiceAssetId;
    private Integer orderIndex;
    private Map<String, Object> metadata;

    public DialogueDTO() {}

    public DialogueDTO(Dialogue d) {
        this.dialogueId = d.getDialogueId();
        this.sceneId = d.getScene() != null ? d.getScene().getSceneId() : null;
        this.characterName = d.getCharacterName();
        this.lineText = d.getLineText();
        this.voiceAssetId = d.getVoiceAsset() != null ? d.getVoiceAsset().getAssetId() : null;
        this.orderIndex = d.getOrderIndex();
        this.metadata = d.getMetadata();
    }

    public Dialogue toEntity(Scene scene, Asset voiceAsset) {
        Dialogue d = new Dialogue();
        d.setDialogueId(this.dialogueId);
        d.setScene(scene);
        d.setCharacterName(this.characterName);
        d.setLineText(this.lineText);
        d.setVoiceAsset(voiceAsset);
        d.setOrderIndex(this.orderIndex);
        d.setMetadata(this.metadata);
        return d;
    }

    public UUID getDialogueId() { return dialogueId; }
    public void setDialogueId(UUID dialogueId) { this.dialogueId = dialogueId; }
    public Integer getSceneId() { return sceneId; }
    public void setSceneId(Integer sceneId) { this.sceneId = sceneId; }
    public String getCharacterName() { return characterName; }
    public void setCharacterName(String characterName) { this.characterName = characterName; }
    public String getLineText() { return lineText; }
    public void setLineText(String lineText) { this.lineText = lineText; }
    public Long getVoiceAssetId() { return voiceAssetId; }
    public void setVoiceAssetId(Long voiceAssetId) { this.voiceAssetId = voiceAssetId; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}


