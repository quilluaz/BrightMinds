package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUserUserId(Long userId);
    List<UserBadge> findByBadgeBadgeId(Long badgeId);
    boolean existsByUserUserIdAndBadgeBadgeId(Long userId, Long badgeId);

    @Query("SELECT ub FROM UserBadge ub JOIN FETCH ub.badge WHERE ub.user.userId = :userId")
    List<UserBadge> findWithBadgeByUserId(@Param("userId") Long userId);

    List<UserBadge> findByEarnedAtBetween(LocalDateTime start, LocalDateTime end);
}



