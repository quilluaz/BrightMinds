package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Dialogue;
import JIZAS.BrightMinds.entity.Scene;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DialogueRepository extends JpaRepository<Dialogue, UUID> {
    List<Dialogue> findBySceneOrderByOrderIndexAsc(Scene scene);
    @Query("SELECT d FROM Dialogue d LEFT JOIN FETCH d.voiceAsset WHERE d.scene.sceneId = :sceneId ORDER BY d.orderIndex ASC")
    List<Dialogue> findByScene_SceneIdOrderByOrderIndexAsc(Integer sceneId);
}


