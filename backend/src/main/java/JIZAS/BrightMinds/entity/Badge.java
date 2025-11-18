package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "badge")
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long badgeId;

    private String name;
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "condition_json", columnDefinition = "jsonb")
    private String conditionJson; // JSON string for complex badge condition

    @OneToMany(mappedBy = "badge")
    private List<UserBadge> userBadges;

    // Getters and Setters
    public Long getBadgeId() { return badgeId; }
    public void setBadgeId(Long badgeId) { this.badgeId = badgeId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getConditionJson() { return conditionJson; }
    public void setConditionJson(String conditionJson) { this.conditionJson = conditionJson; }
    public List<UserBadge> getUserBadges() { return userBadges; }
    public void setUserBadges(List<UserBadge> userBadges) { this.userBadges = userBadges; }
}