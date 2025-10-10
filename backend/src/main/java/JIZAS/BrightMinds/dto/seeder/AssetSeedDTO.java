package JIZAS.BrightMinds.dto.seeder;

import java.util.Map;

public class AssetSeedDTO {
    private String name;
    private String type;
    private String filePath;
    private Float positionX;
    private Float positionY;
    private Integer orderIndex;
    private Boolean isInteractive;
    private Map<String, Object> metadata;
    private Float disappearAfter;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Float getPositionX() { return positionX; }
    public void setPositionX(Float positionX) { this.positionX = positionX; }
    public Float getPositionY() { return positionY; }
    public void setPositionY(Float positionY) { this.positionY = positionY; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public Boolean getIsInteractive() { return isInteractive; }
    public void setIsInteractive(Boolean isInteractive) { this.isInteractive = isInteractive; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    public Float getDisappearAfter() { return disappearAfter; }
    public void setDisappearAfter(Float disappearAfter) { this.disappearAfter = disappearAfter; }
}