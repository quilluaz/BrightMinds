package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.SceneAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SceneAssetRepository extends JpaRepository<SceneAsset, Long> {
    List<SceneAsset> findByScene_SceneId(Integer sceneId);
}


