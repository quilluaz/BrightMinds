package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.entity.UserBadge;
import JIZAS.BrightMinds.service.UserBadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-badges")
@CrossOrigin(origins = "*")
public class UserBadgeController {

    @Autowired
    private UserBadgeService userBadgeService;

    @PostMapping
    public ResponseEntity<UserBadge> createUserBadge(@RequestBody UserBadge userBadge) {
        try {
            UserBadge created = userBadgeService.createUserBadge(userBadge);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/award/{badgeId}")
    public ResponseEntity<UserBadge> awardBadgeToUser(@PathVariable Long badgeId, @RequestBody User user) {
        try {
            UserBadge awarded = userBadgeService.awardBadgeToUser(user, badgeId);
            return new ResponseEntity<>(awarded, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<UserBadge>> getAllUserBadges() {
        return new ResponseEntity<>(userBadgeService.getAllUserBadges(), HttpStatus.OK);
    }

    @GetMapping("/{userBadgeId}")
    public ResponseEntity<UserBadge> getUserBadgeById(@PathVariable Long userBadgeId) {
        Optional<UserBadge> userBadge = userBadgeService.getUserBadgeById(userBadgeId);
        return userBadge.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserBadge>> getUserBadgesByUserId(@PathVariable Long userId) {
        List<UserBadge> items = userBadgeService.getUserBadgesByUserId(userId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/with-badge")
    public ResponseEntity<List<UserBadge>> getUserBadgesWithBadgeByUserId(@PathVariable Long userId) {
        List<UserBadge> items = userBadgeService.getUserBadgesWithBadgeByUserId(userId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/has/{badgeId}")
    public ResponseEntity<Boolean> hasUserEarnedBadge(@PathVariable Long userId, @PathVariable Long badgeId) {
        boolean has = userBadgeService.hasUserEarnedBadge(userId, badgeId);
        return new ResponseEntity<>(has, HttpStatus.OK);
    }

    @GetMapping("/between")
    public ResponseEntity<List<UserBadge>> getUserBadgesBetween(@RequestParam("start") String start,
                                                                @RequestParam("end") String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        List<UserBadge> items = userBadgeService.getUserBadgesEarnedBetween(startTime, endTime);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @PutMapping("/{userBadgeId}")
    public ResponseEntity<UserBadge> updateUserBadge(@PathVariable Long userBadgeId, @RequestBody UserBadge userBadge) {
        try {
            userBadge.setUserBadgeId(userBadgeId);
            UserBadge updated = userBadgeService.updateUserBadge(userBadge);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{userBadgeId}")
    public ResponseEntity<Void> deleteUserBadge(@PathVariable Long userBadgeId) {
        try {
            userBadgeService.deleteUserBadge(userBadgeId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}


