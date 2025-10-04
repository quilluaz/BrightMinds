package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.StoryScoreDTO;
import JIZAS.BrightMinds.service.StoryScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/story-scores")
@CrossOrigin(origins = "*")
public class StoryScoreController {

    @Autowired
    private StoryScoreService storyScoreService;

    @GetMapping("/user/{userId}/story/{storyId}")
    public ResponseEntity<StoryScoreDTO> getStoryScore(
            @PathVariable Long userId,
            @PathVariable Integer storyId) {
        try {
            System.out.println("StoryScoreController: Getting score for user " + userId + ", story " + storyId);
            StoryScoreDTO score = storyScoreService.calculateStoryScore(userId, storyId);
            System.out.println("StoryScoreController: Returning score: " + score);
            return new ResponseEntity<>(score, HttpStatus.OK);
        } catch (RuntimeException e) {
            System.out.println("StoryScoreController: RuntimeException: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.out.println("StoryScoreController: Exception: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/test/user/{userId}/story/{storyId}")
    public ResponseEntity<StoryScoreDTO> getTestStoryScore(
            @PathVariable Long userId,
            @PathVariable Integer storyId) {
        // Return a hardcoded test score
        StoryScoreDTO testScore = new StoryScoreDTO(
                storyId,
                "Test Story",
                9,
                36,
                32,
                88.89,
                4
        );
        System.out.println("StoryScoreController: Returning test score: " + testScore);
        return new ResponseEntity<>(testScore, HttpStatus.OK);
    }
}

