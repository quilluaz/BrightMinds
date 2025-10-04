package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUser_UserId(Long userId);
    List<Progress> findByStory_StoryId(Integer storyId);
    
    // Find progress by user and story
    @Query("SELECT p FROM Progress p WHERE p.user.userId = :userId AND p.story.storyId = :storyId")
    Optional<Progress> findByUserAndStory(@Param("userId") Long userId, @Param("storyId") Integer storyId);
}
