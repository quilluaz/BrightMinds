package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Integer> {
    List<Story> findAllByOrderByStoryOrderAsc();
    java.util.Optional<Story> findByTitle(String title);
}


