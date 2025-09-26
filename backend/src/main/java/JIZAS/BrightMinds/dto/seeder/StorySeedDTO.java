package JIZAS.BrightMinds.dto.seeder;

import java.util.List;

public class StorySeedDTO {
    private String title;
    private String description;
    private int storyOrder;
    private String thumbnailImage;
    private List<SceneSeedDTO> scenes;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getStoryOrder() { return storyOrder; }
    public void setStoryOrder(int storyOrder) { this.storyOrder = storyOrder; }
    public String getThumbnailImage() { return thumbnailImage; }
    public void setThumbnailImage(String thumbnailImage) { this.thumbnailImage = thumbnailImage; }
    public List<SceneSeedDTO> getScenes() { return scenes; }
    public void setScenes(List<SceneSeedDTO> scenes) { this.scenes = scenes; }
}