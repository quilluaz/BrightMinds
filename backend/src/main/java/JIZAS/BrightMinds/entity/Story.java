package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "stories")
public class Story {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "story_id")
    private Integer storyId;
    
    @Column(name = "title")
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "narration_url")
    private String narrationUrl;
    
    @Column(name = "story_order")
    private Integer storyOrder;
    
    @Column(name = "thumbnail_image")
    private String thumbnailImage;
    
    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Scene> scenes;
    
    public Story() {}
    
    public Integer getStoryId() {
        return storyId;
    }
    
    public void setStoryId(Integer storyId) {
        this.storyId = storyId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getNarrationUrl() {
        return narrationUrl;
    }
    
    public void setNarrationUrl(String narrationUrl) {
        this.narrationUrl = narrationUrl;
    }
    
    public Integer getStoryOrder() {
        return storyOrder;
    }
    
    public void setStoryOrder(Integer storyOrder) {
        this.storyOrder = storyOrder;
    }
    
    public String getThumbnailImage() {
        return thumbnailImage;
    }
    
    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }
    
    public List<Scene> getScenes() {
        return scenes;
    }
    
    public void setScenes(List<Scene> scenes) {
        this.scenes = scenes;
    }
}


