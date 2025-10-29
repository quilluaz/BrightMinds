package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens", indexes = {
        @Index(name = "idx_rt_family", columnList = "familyId"),
        @Index(name = "idx_rt_user", columnList = "userId"),
        @Index(name = "idx_rt_expires", columnList = "expiresAt")
})
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String familyId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String tokenHash;

    @Column(nullable = false)
    private Instant issuedAt;

    @Column(nullable = false)
    private Instant expiresAt;

    private Instant usedAt;

    private Instant revokedAt;

    private String userAgent;

    private String ip;

    private Long replacedById;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFamilyId() { return familyId; }
    public void setFamilyId(String familyId) { this.familyId = familyId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTokenHash() { return tokenHash; }
    public void setTokenHash(String tokenHash) { this.tokenHash = tokenHash; }

    public Instant getIssuedAt() { return issuedAt; }
    public void setIssuedAt(Instant issuedAt) { this.issuedAt = issuedAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Instant getUsedAt() { return usedAt; }
    public void setUsedAt(Instant usedAt) { this.usedAt = usedAt; }

    public Instant getRevokedAt() { return revokedAt; }
    public void setRevokedAt(Instant revokedAt) { this.revokedAt = revokedAt; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public Long getReplacedById() { return replacedById; }
    public void setReplacedById(Long replacedById) { this.replacedById = replacedById; }
}


