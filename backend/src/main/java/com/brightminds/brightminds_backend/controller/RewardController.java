package com.brightminds.brightminds_backend.controller;

import com.brightminds.brightminds_backend.model.Reward;
import com.brightminds.brightminds_backend.model.User;
import com.brightminds.brightminds_backend.repository.RewardRepository;
import com.brightminds.brightminds_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    private static final Logger logger = LoggerFactory.getLogger(RewardController.class);

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Reward>> getRewardsByStudent(@RequestParam Long studentId) {
        logger.info("Retrieving rewards for student ID: {}", studentId);
        try {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> {
                        logger.error("Student not found with ID: {}", studentId);
                        return new RuntimeException("Student not found with ID: " + studentId);
                    });
            List<Reward> rewards = rewardRepository.findByStudent(student);
            logger.debug("Found {} rewards for student ID {}", rewards.size(), studentId);
            return ResponseEntity.ok(rewards);
        } catch (Exception e) {
            logger.error("Error retrieving rewards: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/total")
    public ResponseEntity<Integer> getTotalGems(@RequestParam Long studentId) {
        logger.info("Retrieving total gems for student ID: {}", studentId);
        try {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> {
                        logger.error("Student not found with ID: {}", studentId);
                        return new RuntimeException("Student not found with ID: " + studentId);
                    });
            List<Reward> rewards = rewardRepository.findByStudent(student);
            int totalGems = rewards.stream().mapToInt(Reward::getGems).sum();
            logger.debug("Total gems for student ID {}: {}", studentId, totalGems);
            return ResponseEntity.ok(totalGems);
        } catch (Exception e) {
            logger.error("Error retrieving total gems: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }
}