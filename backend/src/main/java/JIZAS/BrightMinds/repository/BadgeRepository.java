package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findByName(String name);
    List<Badge> findByConditionLessThanEqual(Integer condition);
}


