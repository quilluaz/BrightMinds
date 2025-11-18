package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.Badge;

public class BadgeDTO {
    private Long badgeId;
    private String name;
    private String description;
    private String imageUrl;
    private String conditionJson;

    public BadgeDTO() {}

    public BadgeDTO(Badge badge) {
        this.badgeId = badge.getBadgeId();
        this.name = badge.getName();
        this.description = badge.getDescription();
        this.imageUrl = badge.getImageUrl();
        this.conditionJson = badge.getConditionJson();
    }

    public Badge toEntity() {
        Badge badge = new Badge();
        badge.setBadgeId(this.badgeId);
        badge.setName(this.name);
        badge.setDescription(this.description);
        badge.setImageUrl(this.imageUrl);
        badge.setConditionJson(this.conditionJson);
        return badge;
    }

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
}


