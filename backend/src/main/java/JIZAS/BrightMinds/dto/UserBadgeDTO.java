package JIZAS.BrightMinds.dto;

import JIZAS.BrightMinds.entity.UserBadge;
import java.time.LocalDateTime;

public class UserBadgeDTO {
    private Long userBadgeId;
    private Long userId;
    private Long badgeId;
    private LocalDateTime earnedAt;

    public UserBadgeDTO() {}

    public UserBadgeDTO(UserBadge userBadge) {
        this.userBadgeId = userBadge.getUserBadgeId();
        this.userId = userBadge.getUser() != null ? userBadge.getUser().getUserId() : null;
        this.badgeId = userBadge.getBadge() != null ? userBadge.getBadge().getBadgeId() : null;
        this.earnedAt = userBadge.getEarnedAt();
    }

    public UserBadge toEntity() {
        UserBadge userBadge = new UserBadge();
        userBadge.setUserBadgeId(this.userBadgeId);
        userBadge.setEarnedAt(this.earnedAt);
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
}


