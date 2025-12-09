package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.UserBadgeDTO;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.entity.UserBadge;
import JIZAS.BrightMinds.service.UserBadgeService;
import JIZAS.BrightMinds.service.BadgeAwardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-badges")
@Tag(name = "User Badges", description = "API for managing user badge relationships")
public class UserBadgeController {

    @Autowired
    private UserBadgeService userBadgeService;

    @Autowired
    private BadgeAwardService badgeAwardService;

    @PostMapping
    @Operation(summary = "Create a user badge relationship", description = "Creates a new user badge relationship")
    public ResponseEntity<UserBadgeDTO> createUserBadge(@RequestBody UserBadgeDTO userBadgeDTO) {
        try {
            UserBadge userBadge = userBadgeDTO.toEntity();
            UserBadge created = userBadgeService.createUserBadge(userBadge);
            UserBadgeDTO responseDTO = new UserBadgeDTO(created);
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/award/{badgeId}")
    @Operation(summary = "Award a badge to a user", description = "Awards a specific badge to a user")
    public ResponseEntity<UserBadgeDTO> awardBadgeToUser(
            @Parameter(description = "Badge ID") @PathVariable Long badgeId, 
            @RequestBody User user) {
        try {
            UserBadge awarded = userBadgeService.awardBadgeToUser(user, badgeId);
            UserBadgeDTO responseDTO = new UserBadgeDTO(awarded);
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/retroactive/{userId}")
    @Operation(summary = "Check and award retroactive badges", description = "Checks past game attempts for a user and awards badges if conditions were met but badge wasn't awarded.")
    public ResponseEntity<String> checkRetroactiveBadges(@Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            badgeAwardService.checkAndAwardRetroactiveBadges(userId);
            return ResponseEntity.ok("Retroactive badge check completed for user " + userId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/retroactive/all")
    @Operation(summary = "Check and award retroactive badges for ALL users", description = "Checks past game attempts for ALL users and awards badges.")
    public ResponseEntity<String> checkRetroactiveBadgesForAll() {
        try {
            badgeAwardService.checkAndAwardRetroactiveBadgesForAll();
            return ResponseEntity.ok("Global retroactive badge check initiated.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    @Operation(summary = "Get all user badges", description = "Retrieves all user badge relationships")
    public ResponseEntity<List<UserBadgeDTO>> getAllUserBadges() {
        List<UserBadge> userBadges = userBadgeService.getAllUserBadges();
        List<UserBadgeDTO> userBadgeDTOs = userBadges.stream()
                .map(UserBadgeDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(userBadgeDTOs, HttpStatus.OK);
    }

    @GetMapping("/{userBadgeId}")
    @Operation(summary = "Get user badge by ID", description = "Retrieves a specific user badge relationship by ID")
    public ResponseEntity<UserBadgeDTO> getUserBadgeById(
            @Parameter(description = "User Badge ID") @PathVariable Long userBadgeId) {
        Optional<UserBadge> userBadge = userBadgeService.getUserBadgeById(userBadgeId);
        return userBadge.map(value -> new ResponseEntity<>(new UserBadgeDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user badges by user ID", description = "Retrieves all badges for a specific user")
    public ResponseEntity<List<UserBadgeDTO>> getUserBadgesByUserId(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        List<UserBadge> items = userBadgeService.getUserBadgesByUserId(userId);
        List<UserBadgeDTO> userBadgeDTOs = items.stream()
                .map(UserBadgeDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(userBadgeDTOs, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/with-badge")
    @Operation(summary = "Get user badges with badge details", description = "Retrieves all badges for a user with full badge information")
    public ResponseEntity<List<UserBadgeDTO>> getUserBadgesWithBadgeByUserId(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        List<UserBadge> items = userBadgeService.getUserBadgesWithBadgeByUserId(userId);
        List<UserBadgeDTO> userBadgeDTOs = items.stream()
                .map(UserBadgeDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(userBadgeDTOs, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/has/{badgeId}")
    @Operation(summary = "Check if user has earned a badge", description = "Checks if a user has earned a specific badge")
    public ResponseEntity<Boolean> hasUserEarnedBadge(
            @Parameter(description = "User ID") @PathVariable Long userId, 
            @Parameter(description = "Badge ID") @PathVariable Long badgeId) {
        boolean has = userBadgeService.hasUserEarnedBadge(userId, badgeId);
        return new ResponseEntity<>(has, HttpStatus.OK);
    }

    @GetMapping("/between")
    @Operation(summary = "Get user badges earned between dates", description = "Retrieves user badges earned within a specific date range")
    public ResponseEntity<List<UserBadgeDTO>> getUserBadgesBetween(
            @Parameter(description = "Start date (ISO format)") @RequestParam("start") String start,
            @Parameter(description = "End date (ISO format)") @RequestParam("end") String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        List<UserBadge> items = userBadgeService.getUserBadgesEarnedBetween(startTime, endTime);
        List<UserBadgeDTO> userBadgeDTOs = items.stream()
                .map(UserBadgeDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(userBadgeDTOs, HttpStatus.OK);
    }

    @PutMapping("/{userBadgeId}")
    @Operation(summary = "Update a user badge", description = "Updates an existing user badge relationship")
    public ResponseEntity<UserBadgeDTO> updateUserBadge(
            @Parameter(description = "User Badge ID") @PathVariable Long userBadgeId, 
            @RequestBody UserBadgeDTO userBadgeDTO) {
        try {
            UserBadge userBadge = userBadgeDTO.toEntity();
            userBadge.setUserBadgeId(userBadgeId);
            UserBadge updated = userBadgeService.updateUserBadge(userBadge);
            UserBadgeDTO responseDTO = new UserBadgeDTO(updated);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{userBadgeId}")
    @Operation(summary = "Delete a user badge", description = "Deletes a user badge relationship")
    public ResponseEntity<Void> deleteUserBadge(
            @Parameter(description = "User Badge ID") @PathVariable Long userBadgeId) {
        try {
            userBadgeService.deleteUserBadge(userBadgeId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}




