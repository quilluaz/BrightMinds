package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.service.BadgeAwardService;
import JIZAS.BrightMinds.service.SeederService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/badge-management")
@Tag(name = "Badge Management", description = "API for managing badge system and retroactive badge awarding")
public class BadgeManagementController {

    @Autowired
    private BadgeAwardService badgeAwardService;

    @Autowired
    private SeederService seederService;

    @PostMapping("/seed-badges")
    @Operation(summary = "Seed initial badges", 
               description = "Creates the initial set of badges in the system")
    public ResponseEntity<String> seedBadges() {
        try {
            seederService.seedBadges();
            return ResponseEntity.ok("Badges have been successfully seeded.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error seeding badges: " + e.getMessage());
        }
    }

    @PostMapping("/check-retroactive-badges/{userId}")
    @Operation(summary = "Check and award retroactive badges for a user", 
               description = "Reviews all game attempts for a user and awards any missing badges")
    public ResponseEntity<String> checkRetroactiveBadges(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            badgeAwardService.checkAndAwardRetroactiveBadges(userId);
            return ResponseEntity.ok("Retroactive badge check completed for user " + userId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error checking retroactive badges: " + e.getMessage());
        }
    }

    @PostMapping("/check-all-users-retroactive-badges")
    @Operation(summary = "Check and award retroactive badges for all users", 
               description = "Reviews all game attempts for all users and awards any missing badges")
    public ResponseEntity<String> checkAllUsersRetroactiveBadges() {
        try {
            // This would require getting all users and checking their badges
            // For now, we'll return a message indicating this feature needs implementation
            return ResponseEntity.ok("Feature not yet implemented. Use individual user endpoint instead.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error checking retroactive badges for all users: " + e.getMessage());
        }
    }
}
