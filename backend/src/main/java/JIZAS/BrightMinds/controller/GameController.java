package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.*;
import JIZAS.BrightMinds.service.GameService;
import JIZAS.BrightMinds.service.ProgressService;
import JIZAS.BrightMinds.service.UserResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private ProgressService progressService;

    @Autowired
    private UserResponseService userResponseService;

    @GetMapping("/scene/{sceneId}")
    public ResponseEntity<GameSceneDTO> getGameScene(@PathVariable Integer sceneId) {
        try {
            GameSceneDTO gameScene = gameService.getGameScene(sceneId);
            return new ResponseEntity<>(gameScene, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/progress/check/{userId}/{storyId}")
    public ResponseEntity<GameProgressDTO> checkGameProgress(@PathVariable Long userId, @PathVariable Integer storyId) {
        try {
            GameProgressDTO progress = progressService.checkExistingProgress(userId, storyId);
            return new ResponseEntity<>(progress, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/progress/save")
    public ResponseEntity<ProgressViewDTO> saveProgress(@RequestBody SaveProgressDTO saveProgressDTO) {
        try {
            ProgressViewDTO progress = progressService.saveProgressAfterAnswer(saveProgressDTO);
            if (progress != null) {
                return new ResponseEntity<>(progress, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/next-scene/{userId}/{storyId}")
    public ResponseEntity<Integer> getNextScene(@PathVariable Long userId, @PathVariable Integer storyId) {
        try {
            Integer nextSceneId = progressService.getNextSceneId(userId, storyId);
            if (nextSceneId != null) {
                return new ResponseEntity<>(nextSceneId, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/start/{userId}/{storyId}")
    public ResponseEntity<GameProgressDTO> startGame(@PathVariable Long userId, @PathVariable Integer storyId) {
        try {
            // Check for existing progress
            GameProgressDTO progress = progressService.checkExistingProgress(userId, storyId);
            
            if (progress.isHasExistingProgress()) {
                // Return existing progress for user to decide
                return new ResponseEntity<>(progress, HttpStatus.OK);
            } else {
                // No existing progress, start fresh
                progress.setHasExistingProgress(false);
                return new ResponseEntity<>(progress, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/continue/{userId}/{storyId}")
    public ResponseEntity<GameProgressDTO> continueGame(@PathVariable Long userId, @PathVariable Integer storyId) {
        try {
            GameProgressDTO progress = progressService.checkExistingProgress(userId, storyId);
            return new ResponseEntity<>(progress, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/restart/{userId}/{storyId}")
    public ResponseEntity<GameProgressDTO> restartGame(@PathVariable Long userId, @PathVariable Integer storyId) {
        try {
            // Delete existing progress
            progressService.deleteByUserAndStory(userId, storyId);
            
            // Return fresh progress
            GameProgressDTO progress = new GameProgressDTO();
            progress.setUserId(userId);
            progress.setStoryId(storyId);
            progress.setHasExistingProgress(false);
            progress.setScore(0);
            
            return new ResponseEntity<>(progress, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/save-scene-progress")
    public ResponseEntity<ProgressViewDTO> saveSceneProgress(@RequestBody SaveProgressDTO saveProgressDTO) {
        try {
            ProgressViewDTO progress = progressService.saveProgressAfterScene(saveProgressDTO);
            if (progress != null) {
                return new ResponseEntity<>(progress, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/save-wrong-answer")
    public ResponseEntity<ProgressViewDTO> saveWrongAnswer(@RequestBody SaveProgressDTO saveProgressDTO) {
        try {
            ProgressViewDTO progress = progressService.saveWrongAnswerState(saveProgressDTO);
            if (progress != null) {
                return new ResponseEntity<>(progress, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}