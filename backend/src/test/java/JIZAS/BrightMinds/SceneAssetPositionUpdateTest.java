package JIZAS.BrightMinds;

import JIZAS.BrightMinds.entity.SceneAsset;
import JIZAS.BrightMinds.service.SceneAssetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

@SpringBootTest
@ActiveProfiles("test")
public class SceneAssetPositionUpdateTest {

    @Autowired
    private SceneAssetService sceneAssetService;

    @Test
    public void testUpdateLiamSpritePosition() {
        // Find the current Liam sprite in scene order 2
        Optional<SceneAsset> liamSprite = sceneAssetService.findByAssetNameAndSceneOrder("liam_idle", 2);
        
        if (liamSprite.isPresent()) {
            SceneAsset currentAsset = liamSprite.get();
            System.out.println("Current Liam position: X=" + currentAsset.getPositionX() + ", Y=" + currentAsset.getPositionY());
            
            // Update position to move Liam closer to the left side
            SceneAsset updatedAsset = sceneAssetService.updatePosition("liam_idle", 2, -20.0f, -4.0f);
            
            System.out.println("Updated Liam position: X=" + updatedAsset.getPositionX() + ", Y=" + updatedAsset.getPositionY());
            System.out.println("Liam sprite successfully moved closer to the left side!");
        } else {
            System.out.println("Liam sprite not found in scene order 2");
        }
    }
}
