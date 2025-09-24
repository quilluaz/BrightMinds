package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Dialogue;
import JIZAS.BrightMinds.entity.Scene;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DialogueRepository extends JpaRepository<Dialogue, UUID> {
    List<Dialogue> findBySceneOrderByOrderIndexAsc(Scene scene);
    List<Dialogue> findByScene_SceneIdOrderByOrderIndexAsc(Integer sceneId);
}


