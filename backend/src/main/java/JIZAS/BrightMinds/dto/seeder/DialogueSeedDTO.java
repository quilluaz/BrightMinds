package JIZAS.BrightMinds.dto.seeder;

public class DialogueSeedDTO {
    private String characterName;
    private String lineText;
    private String lineTextTl;
    private int orderIndex;
    private String voiceover;

    // Getters and Setters
    public String getCharacterName() { return characterName; }
    public void setCharacterName(String characterName) { this.characterName = characterName; }
    public String getLineText() { return lineText; }
    public void setLineText(String lineText) { this.lineText = lineText; }
    public String getLineTextTl() { return lineTextTl; }
    public void setLineTextTl(String lineTextTl) { this.lineTextTl = lineTextTl; }
    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
    public String getVoiceover() { return voiceover; }
    public void setVoiceover(String voiceover) { this.voiceover = voiceover; }
}