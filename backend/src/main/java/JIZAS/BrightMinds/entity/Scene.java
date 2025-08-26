package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "scenes")
public class Scene {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scene_id")
    private Integer sceneId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id")
    private Story story;
    
    @Column(name = "scene_order")
    private Integer sceneOrder;
    
    @Column(name = "scene_text", columnDefinition = "TEXT")
    private String sceneText;
    
    @Column(name = "voiceover_url")
    private String voiceoverUrl;
    
    @Column(name = "background_image_url")
    private String backgroundImageUrl;
    
    public Scene() {}
    
    public Integer getSceneId() {
        return sceneId;
    }
    
    public void setSceneId(Integer sceneId) {
        this.sceneId = sceneId;
    }
    
    public Story getStory() {
        return story;
    }
    
    public void setStory(Story story) {
        this.story = story;
    }
    
    public Integer getSceneOrder() {
        return sceneOrder;
    }
    
    public void setSceneOrder(Integer sceneOrder) {
        this.sceneOrder = sceneOrder;
    }
    
    public String getSceneText() {
        return sceneText;
    }
    
    public void setSceneText(String sceneText) {
        this.sceneText = sceneText;
    }
    
    public String getVoiceoverUrl() {
        return voiceoverUrl;
    }
    
    public void setVoiceoverUrl(String voiceoverUrl) {
        this.voiceoverUrl = voiceoverUrl;
    }
    
    public String getBackgroundImageUrl() {
        return backgroundImageUrl;
    }
    
    public void setBackgroundImageUrl(String backgroundImageUrl) {
        this.backgroundImageUrl = backgroundImageUrl;
    }
}


