package JIZAS.BrightMinds.dto.seeder;

import java.util.List;

public class StorySeedDTO {
    private String title;
    private String description;
    private Integer storyOrder;
    private String thumbnailImage;
    private String gameplayType;
    private List<SceneSeedDTO> scenes;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getStoryOrder() { return storyOrder; }
    public void setStoryOrder(Integer storyOrder) { this.storyOrder = storyOrder; }
    public String getThumbnailImage() { return thumbnailImage; }
    public void setThumbnailImage(String thumbnailImage) { this.thumbnailImage = thumbnailImage; }
    public String getGameplayType() { return gameplayType; }
    public void setGameplayType(String gameplayType) { this.gameplayType = gameplayType; }
    public List<SceneSeedDTO> getScenes() { return scenes; }
    public void setScenes(List<SceneSeedDTO> scenes) { this.scenes = scenes; }
}
