package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.SceneAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SceneAssetRepository extends JpaRepository<SceneAsset, Long> {
    List<SceneAsset> findByScene_SceneId(Integer sceneId);
    
    @Query("SELECT sa FROM SceneAsset sa JOIN sa.asset a JOIN sa.scene s WHERE a.name = :assetName AND s.sceneOrder = :sceneOrder")
    Optional<SceneAsset> findByAssetNameAndSceneOrder(@Param("assetName") String assetName, @Param("sceneOrder") Integer sceneOrder);
}


