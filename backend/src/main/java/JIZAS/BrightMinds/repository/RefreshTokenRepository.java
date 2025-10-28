package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByIdAndUserId(Long id, Long userId);
    List<RefreshToken> findByFamilyId(String familyId);
    List<RefreshToken> findByUserIdAndExpiresAtAfter(Long userId, Instant now);
}


