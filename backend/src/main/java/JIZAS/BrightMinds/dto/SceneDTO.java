package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.Scene;
import JIZAS.BrightMinds.entity.Story;

public class SceneDTO {
    private Integer sceneId;
    private Integer storyId;
    private Integer sceneOrder;
    private String sceneText;
    private String voiceoverUrl;
    private String backgroundImageUrl;
    
    public SceneDTO() {}
    
    public SceneDTO(Scene scene) {
        this.sceneId = scene.getSceneId();
        this.storyId = scene.getStory() != null ? scene.getStory().getStoryId() : null;
        this.sceneOrder = scene.getSceneOrder();
        this.sceneText = scene.getSceneText();
        this.voiceoverUrl = scene.getVoiceoverUrl();
        this.backgroundImageUrl = scene.getBackgroundImageUrl();
    }
    
    public Scene toEntity(Story story) {
        Scene s = new Scene();
        s.setSceneId(this.sceneId);
        s.setStory(story);
        s.setSceneOrder(this.sceneOrder);
        s.setSceneText(this.sceneText);
        s.setVoiceoverUrl(this.voiceoverUrl);
        s.setBackgroundImageUrl(this.backgroundImageUrl);
        return s;
    }
    
    public Integer getSceneId() { return sceneId; }
    public void setSceneId(Integer sceneId) { this.sceneId = sceneId; }
    public Integer getStoryId() { return storyId; }
    public void setStoryId(Integer storyId) { this.storyId = storyId; }
    public Integer getSceneOrder() { return sceneOrder; }
    public void setSceneOrder(Integer sceneOrder) { this.sceneOrder = sceneOrder; }
    public String getSceneText() { return sceneText; }
    public void setSceneText(String sceneText) { this.sceneText = sceneText; }
    public String getVoiceoverUrl() { return voiceoverUrl; }
    public void setVoiceoverUrl(String voiceoverUrl) { this.voiceoverUrl = voiceoverUrl; }
    public String getBackgroundImageUrl() { return backgroundImageUrl; }
    public void setBackgroundImageUrl(String backgroundImageUrl) { this.backgroundImageUrl = backgroundImageUrl; }
}


