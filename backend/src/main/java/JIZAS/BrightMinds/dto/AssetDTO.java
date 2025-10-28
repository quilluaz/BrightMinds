package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.Asset;
import java.util.Map;

public class AssetDTO {
    private Long assetId;
    private String name;
    private String type;
    private String filePath;
    private Map<String, Object> metadata;

    public AssetDTO() {}

    public AssetDTO(Asset asset) {
        this.assetId = asset.getAssetId();
        this.name = asset.getName();
        this.type = asset.getType();
        this.filePath = asset.getFilePath();
        this.metadata = asset.getMetadata();
    }

    // Getters and Setters
    public Long getAssetId() { return assetId; }
    public void setAssetId(Long assetId) { this.assetId = assetId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}