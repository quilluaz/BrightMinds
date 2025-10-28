package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.BadgeDTO;
import JIZAS.BrightMinds.entity.Badge;
import JIZAS.BrightMinds.service.BadgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/badges")
@Tag(name = "Badges", description = "API for managing badges")
@CrossOrigin(origins = "*")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @PostMapping
    @Operation(summary = "Create a new badge", description = "Creates a new badge in the system")
    public ResponseEntity<BadgeDTO> createBadge(@RequestBody BadgeDTO badgeDTO) {
        try {
            Badge badge = badgeDTO.toEntity();
            Badge created = badgeService.createBadge(badge);
            BadgeDTO responseDTO = new BadgeDTO(created);
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    @Operation(summary = "Get all badges", description = "Retrieves all badges in the system")
    public ResponseEntity<List<BadgeDTO>> getAllBadges() {
        List<Badge> badges = badgeService.getAllBadges();
        List<BadgeDTO> badgeDTOs = badges.stream()
                .map(BadgeDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(badgeDTOs, HttpStatus.OK);
    }

    @GetMapping("/{badgeId}")
    @Operation(summary = "Get badge by ID", description = "Retrieves a specific badge by its ID")
    public ResponseEntity<BadgeDTO> getBadgeById(
            @Parameter(description = "Badge ID") @PathVariable Long badgeId) {
        Optional<Badge> badge = badgeService.getBadgeById(badgeId);
        return badge.map(value -> new ResponseEntity<>(new BadgeDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get badge by name", description = "Retrieves a specific badge by its name")
    public ResponseEntity<BadgeDTO> getBadgeByName(
            @Parameter(description = "Badge name") @PathVariable String name) {
        Optional<Badge> badge = badgeService.getBadgeByName(name);
        return badge.map(value -> new ResponseEntity<>(new BadgeDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/condition/{condition}")
    @Operation(summary = "Get badges by condition", description = "Retrieves badges that can be earned at or below the specified condition")
    public ResponseEntity<List<BadgeDTO>> getBadgesByConditionAtOrBelow(
            @Parameter(description = "Condition threshold") @PathVariable Integer condition) {
        List<Badge> badges = badgeService.getBadgesEarnableAtOrBelowCondition(condition);
        List<BadgeDTO> badgeDTOs = badges.stream()
                .map(BadgeDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(badgeDTOs, HttpStatus.OK);
    }

    @PutMapping("/{badgeId}")
    @Operation(summary = "Update a badge", description = "Updates an existing badge")
    public ResponseEntity<BadgeDTO> updateBadge(
            @Parameter(description = "Badge ID") @PathVariable Long badgeId, 
            @RequestBody BadgeDTO badgeDTO) {
        try {
            Badge badge = badgeDTO.toEntity();
            badge.setBadgeId(badgeId);
            Badge updated = badgeService.updateBadge(badge);
            BadgeDTO responseDTO = new BadgeDTO(updated);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{badgeId}")
    @Operation(summary = "Delete a badge", description = "Deletes a badge from the system")
    public ResponseEntity<Void> deleteBadge(
            @Parameter(description = "Badge ID") @PathVariable Long badgeId) {
        try {
            badgeService.deleteBadge(badgeId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}




