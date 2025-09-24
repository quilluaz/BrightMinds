package JIZAS.BrightMinds.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Entity
@Table(name = "scenes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Scene {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scene_id")
    private Integer sceneId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id")
    @JsonBackReference
    private Story story;

    @Column(name = "scene_order")
    private Integer sceneOrder;

    @Column(name = "scene_text", columnDefinition = "TEXT")
    private String sceneText;

    @OneToMany(mappedBy = "scene", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Dialogue> dialogues;


    public Scene() {
    }

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

    public List<Dialogue> getDialogues() { return dialogues; }
    public void setDialogues(List<Dialogue> dialogues) { this.dialogues = dialogues; }

}