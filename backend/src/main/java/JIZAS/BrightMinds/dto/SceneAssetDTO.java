package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.SceneAsset;

public class SceneAssetDTO {
    private Long sceneAssetId;
    private Long assetId;
    private String name;
    private String type;
    private String filePath;
    private Float positionX;
    private Float positionY;
    private Boolean isInteractive;
    private Integer orderIndex;
    private Object metadata;

    public SceneAssetDTO() {}

    public SceneAssetDTO(SceneAsset sceneAsset) {
        this.sceneAssetId = sceneAsset.getSceneAssetId();
        this.assetId = sceneAsset.getAsset().getAssetId();
        this.name = sceneAsset.getAsset().getName();
        this.type = sceneAsset.getAsset().getType();
        this.filePath = sceneAsset.getAsset().getFilePath();
        this.positionX = sceneAsset.getPositionX();
        this.positionY = sceneAsset.getPositionY();
        this.isInteractive = sceneAsset.getIsInteractive();
        this.orderIndex = sceneAsset.getOrderIndex();
        this.metadata = sceneAsset.getMetadata();
        
        // Debug logging
        System.out.println("SceneAssetDTO for " + this.name + ": metadata = " + this.metadata);
    }

    // Getters and Setters
    public Long getSceneAssetId() { return sceneAssetId; }
    public void setSceneAssetId(Long sceneAssetId) { this.sceneAssetId = sceneAssetId; }
    
    public Long getAssetId() { return assetId; }
    public void setAssetId(Long assetId) { this.assetId = assetId; }
    
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
    
    public Boolean getIsInteractive() { return isInteractive; }
    public void setIsInteractive(Boolean isInteractive) { this.isInteractive = isInteractive; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    public Object getMetadata() { return metadata; }
    public void setMetadata(Object metadata) { this.metadata = metadata; }
}
