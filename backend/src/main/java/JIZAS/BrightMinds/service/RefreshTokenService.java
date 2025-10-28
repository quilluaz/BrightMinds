package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.RefreshToken;
import JIZAS.BrightMinds.repository.RefreshTokenRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repo;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();

    // 7 days default
    private static final Duration DEFAULT_TTL = Duration.ofDays(7);

    public RefreshTokenService(RefreshTokenRepository repo) {
        this.repo = repo;
    }

    public static class IssuedToken {
        public final String cookieValue; // format: id.secret
        public final String familyId;
        public IssuedToken(String cookieValue, String familyId) { this.cookieValue = cookieValue; this.familyId = familyId; }
    }

    public IssuedToken issueNewFamily(Long userId, String ip, String userAgent) {
        String familyId = UUID.randomUUID().toString();
        return issueToken(userId, familyId, ip, userAgent);
    }

    public IssuedToken rotate(Long tokenId, String secret, Long userId, String ip, String userAgent) {
        RefreshToken current = repo.findByIdAndUserId(tokenId, userId).orElse(null);
        if (current == null) throw new IllegalStateException("Invalid refresh token");
        if (current.getUsedAt() != null || current.getRevokedAt() != null) {
            revokeFamily(current.getFamilyId());
            throw new IllegalStateException("Refresh token reuse detected");
        }
        if (current.getExpiresAt().isBefore(Instant.now())) {
            revokeFamily(current.getFamilyId());
            throw new IllegalStateException("Refresh token expired");
        }
        if (!encoder.matches(secret, current.getTokenHash())) {
            throw new IllegalStateException("Invalid refresh token");
        }
        current.setUsedAt(Instant.now());
        repo.save(current);
        IssuedToken next = issueToken(userId, current.getFamilyId(), ip, userAgent);
        current.setReplacedById(parseId(next.cookieValue));
        repo.save(current);
        return next;
    }

    public static class RotationResult {
        public final IssuedToken issued;
        public final Long userId;
        public RotationResult(IssuedToken issued, Long userId) { this.issued = issued; this.userId = userId; }
    }

    public RotationResult rotateByCookie(String cookieValue, String ip, String userAgent) {
        if (cookieValue == null || !cookieValue.contains(".")) {
            throw new IllegalStateException("Invalid refresh token");
        }
        int dot = cookieValue.indexOf('.');
        Long id;
        try { id = Long.parseLong(cookieValue.substring(0, dot)); } catch (NumberFormatException e) { throw new IllegalStateException("Invalid refresh token"); }
        String secret = cookieValue.substring(dot + 1);
        RefreshToken current = repo.findById(id).orElse(null);
        if (current == null) throw new IllegalStateException("Invalid refresh token");
        Long userId = current.getUserId();
        IssuedToken next = rotate(id, secret, userId, ip, userAgent);
        return new RotationResult(next, userId);
    }

    public void revokeFamily(String familyId) {
        List<RefreshToken> family = repo.findByFamilyId(familyId);
        Instant now = Instant.now();
        for (RefreshToken rt : family) {
            if (rt.getRevokedAt() == null) {
                rt.setRevokedAt(now);
            }
        }
        repo.saveAll(family);
    }

    private IssuedToken issueToken(Long userId, String familyId, String ip, String userAgent) {
        String secret = generateSecret();
        String hash = encoder.encode(secret);
        RefreshToken rt = new RefreshToken();
        rt.setFamilyId(familyId);
        rt.setUserId(userId);
        rt.setTokenHash(hash);
        rt.setIssuedAt(Instant.now());
        rt.setExpiresAt(Instant.now().plus(DEFAULT_TTL));
        rt.setIp(ip);
        rt.setUserAgent(userAgent);
        repo.save(rt);
        String cookieValue = rt.getId() + "." + secret;
        return new IssuedToken(cookieValue, familyId);
    }

    private String generateSecret() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private Long parseId(String cookieValue) {
        int dot = cookieValue.indexOf('.');
        if (dot <= 0) return null;
        try { return Long.parseLong(cookieValue.substring(0, dot)); } catch (NumberFormatException e) { return null; }
    }
}


