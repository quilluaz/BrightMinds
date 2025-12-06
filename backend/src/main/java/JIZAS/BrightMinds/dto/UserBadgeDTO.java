package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.UserBadge;
import java.time.LocalDateTime;

public class UserBadgeDTO {
    private Long userBadgeId;
    private Long userId;
    private Long badgeId;
    private LocalDateTime earnedAt;
    private BadgeDTO badge;

    public UserBadgeDTO() {}

    public UserBadgeDTO(UserBadge userBadge) {
        this.userBadgeId = userBadge.getUserBadgeId();
        this.userId = userBadge.getUser() != null ? userBadge.getUser().getUserId() : null;
        this.badgeId = userBadge.getBadge() != null ? userBadge.getBadge().getBadgeId() : null;
        this.earnedAt = userBadge.getEarnedAt();
        if (userBadge.getBadge() != null) {
            this.badge = new BadgeDTO(userBadge.getBadge());
        }
    }

    public UserBadge toEntity() {
        UserBadge userBadge = new UserBadge();
        userBadge.setUserBadgeId(this.userBadgeId);
        userBadge.setEarnedAt(this.earnedAt);
        // Note: We typically don't set the full badge entity back from DTO in this context 
        // to avoid complexity, usually ID is enough for linking.
        return userBadge;
    }

    public Long getUserBadgeId() { return userBadgeId; }
    public void setUserBadgeId(Long userBadgeId) { this.userBadgeId = userBadgeId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getBadgeId() { return badgeId; }
    public void setBadgeId(Long badgeId) { this.badgeId = badgeId; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
    public BadgeDTO getBadge() { return badge; }
    public void setBadge(BadgeDTO badge) { this.badge = badge; }
}




