package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUser_UserId(Long userId);
    List<Progress> findByStory_StoryId(Integer storyId);
}
