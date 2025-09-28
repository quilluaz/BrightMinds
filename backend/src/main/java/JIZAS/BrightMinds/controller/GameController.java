package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.GameSceneDTO;
import JIZAS.BrightMinds.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping("/scene/{sceneId}")
    public ResponseEntity<GameSceneDTO> getGameScene(@PathVariable Integer sceneId) {
        try {
            GameSceneDTO gameScene = gameService.getGameScene(sceneId);
            return new ResponseEntity<>(gameScene, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}