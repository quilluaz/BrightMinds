package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Scene;
import JIZAS.BrightMinds.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SceneRepository extends JpaRepository<Scene, Integer> {
    List<Scene> findByStoryOrderBySceneOrderAsc(Story story);
    List<Scene> findByStory_StoryIdOrderBySceneOrderAsc(Integer storyId);
    List<Scene> findByStoryStoryIdOrderBySceneOrder(Integer storyId);
    void deleteByStory(Story story);
}


