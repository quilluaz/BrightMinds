package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.Story;
import java.util.List;
import java.util.stream.Collectors;

public class StoryDTO {
    private Integer storyId;
    private String title;
    private String description;
    private String narrationUrl;
    private Integer storyOrder;
    private String thumbnailImage;
    private List<SceneDTO> scenes;
    
    public StoryDTO() {}
    
    public StoryDTO(Story story) {
        this.storyId = story.getStoryId();
        this.title = story.getTitle();
        this.description = story.getDescription();
        this.narrationUrl = story.getNarrationUrl();
        this.storyOrder = story.getStoryOrder();
        this.thumbnailImage = story.getThumbnailImage();
        if (story.getScenes() != null) {
            this.scenes = story.getScenes().stream().map(SceneDTO::new).collect(Collectors.toList());
        }
    }
    
    public Story toEntity() {
        Story s = new Story();
        s.setStoryId(this.storyId);
        s.setTitle(this.title);
        s.setDescription(this.description);
        s.setNarrationUrl(this.narrationUrl);
        s.setStoryOrder(this.storyOrder);
        s.setThumbnailImage(this.thumbnailImage);
        return s;
    }
    
    public Integer getStoryId() { return storyId; }
    public void setStoryId(Integer storyId) { this.storyId = storyId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getNarrationUrl() { return narrationUrl; }
    public void setNarrationUrl(String narrationUrl) { this.narrationUrl = narrationUrl; }
    public Integer getStoryOrder() { return storyOrder; }
    public void setStoryOrder(Integer storyOrder) { this.storyOrder = storyOrder; }
    public String getThumbnailImage() { return thumbnailImage; }
    public void setThumbnailImage(String thumbnailImage) { this.thumbnailImage = thumbnailImage; }
    public List<SceneDTO> getScenes() { return scenes; }
    public void setScenes(List<SceneDTO> scenes) { this.scenes = scenes; }
}


