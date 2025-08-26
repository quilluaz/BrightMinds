package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.entity.Badge;
import JIZAS.BrightMinds.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/badges")
@CrossOrigin(origins = "*")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @PostMapping
    public ResponseEntity<Badge> createBadge(@RequestBody Badge badge) {
        try {
            Badge created = badgeService.createBadge(badge);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Badge>> getAllBadges() {
        return new ResponseEntity<>(badgeService.getAllBadges(), HttpStatus.OK);
    }

    @GetMapping("/{badgeId}")
    public ResponseEntity<Badge> getBadgeById(@PathVariable Long badgeId) {
        Optional<Badge> badge = badgeService.getBadgeById(badgeId);
        return badge.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Badge> getBadgeByName(@PathVariable String name) {
        Optional<Badge> badge = badgeService.getBadgeByName(name);
        return badge.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/condition/{condition}")
    public ResponseEntity<List<Badge>> getBadgesByConditionAtOrBelow(@PathVariable Integer condition) {
        List<Badge> badges = badgeService.getBadgesEarnableAtOrBelowCondition(condition);
        return new ResponseEntity<>(badges, HttpStatus.OK);
    }

    @PutMapping("/{badgeId}")
    public ResponseEntity<Badge> updateBadge(@PathVariable Long badgeId, @RequestBody Badge badge) {
        try {
            badge.setBadgeId(badgeId);
            Badge updated = badgeService.updateBadge(badge);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{badgeId}")
    public ResponseEntity<Void> deleteBadge(@PathVariable Long badgeId) {
        try {
            badgeService.deleteBadge(badgeId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}



