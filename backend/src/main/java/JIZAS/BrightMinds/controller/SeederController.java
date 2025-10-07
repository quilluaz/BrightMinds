package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.seeder.StorySeedDTO;
import JIZAS.BrightMinds.service.SeederService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seeder") // Using a more neutral path
@CrossOrigin(origins = "*")
public class SeederController {

    private final SeederService seederService;

    public SeederController(SeederService seederService) {
        this.seederService = seederService;
    }

    @PostMapping("/story")
    public ResponseEntity<String> seedNewStory(@RequestBody StorySeedDTO storyDTO) {
        try {
            seederService.seedStory(storyDTO);
            return ResponseEntity.ok("Story has been successfully seeded.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error seeding story: " + e.getMessage());
        }
    }

    @PostMapping("/create-gamemaster")
    public ResponseEntity<String> createGameMaster() {
        try {
            seederService.createGameMaster();
            return ResponseEntity.ok("GameMaster user created or already exists.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating GameMaster: " + e.getMessage());
        }
    }
}

