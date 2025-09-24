package JIZAS.BrightMinds.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Map;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "dialogue")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Dialogue {

    @Id
    @UuidGenerator
    @Column(name = "dialogue_id", columnDefinition = "uuid")
    private UUID dialogueId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scene_id", nullable = false)
    @JsonBackReference
    private Scene scene;

    @Column(name = "character_name")
    private String characterName;

    @Column(name = "line_text", columnDefinition = "TEXT")
    private String lineText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voice_asset_id")
    private Asset voiceAsset;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "metadata", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> metadata;

    public UUID getDialogueId() { return dialogueId; }
    public void setDialogueId(UUID dialogueId) { this.dialogueId = dialogueId; }

    public Scene getScene() { return scene; }
    public void setScene(Scene scene) { this.scene = scene; }

    public String getCharacterName() { return characterName; }
    public void setCharacterName(String characterName) { this.characterName = characterName; }

    public String getLineText() { return lineText; }
    public void setLineText(String lineText) { this.lineText = lineText; }

    public Asset getVoiceAsset() { return voiceAsset; }
    public void setVoiceAsset(Asset voiceAsset) { this.voiceAsset = voiceAsset; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}