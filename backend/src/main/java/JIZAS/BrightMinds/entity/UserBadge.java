package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_badge")
public class UserBadge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userBadgeId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "badge_id")
    private Badge badge;

    @Column(name = "earned_at")
    private LocalDateTime earnedAt;

    // Getters and Setters
    public Long getUserBadgeId() { return userBadgeId; }
    public void setUserBadgeId(Long userBadgeId) { this.userBadgeId = userBadgeId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Badge getBadge() { return badge; }
    public void setBadge(Badge badge) { this.badge = badge; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
}