package JIZAS.BrightMinds.dto.seeder;

public class DialogueSeedDTO {
    private String characterName;
    private String lineText;
    private int orderIndex;
    private String voiceover;

    // Getters and Setters
    public String getCharacterName() { return characterName; }
    public void setCharacterName(String characterName) { this.characterName = characterName; }
    public String getLineText() { return lineText; }
    public void setLineText(String lineText) { this.lineText = lineText; }
    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
    public String getVoiceover() { return voiceover; }
    public void setVoiceover(String voiceover) { this.voiceover = voiceover; }
}