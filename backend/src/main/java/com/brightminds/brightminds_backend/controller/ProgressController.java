package com.brightminds.brightminds_backend.controller;

import com.brightminds.brightminds_backend.model.Progress;
import com.brightminds.brightminds_backend.model.User;
import com.brightminds.brightminds_backend.repository.ProgressRepository;
import com.brightminds.brightminds_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private static final Logger logger = LoggerFactory.getLogger(ProgressController.class);

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProgressByStudent(@RequestParam Long studentId) {
        logger.info("Retrieving progress for student ID: {}", studentId);
        try {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> {
                        logger.error("Student not found with ID: {}", studentId);
                        return new RuntimeException("Student not found with ID: " + studentId);
                    });
            List<Progress> progressList = progressRepository.findByStudent(student);
            logger.debug("Found {} progress entries for student ID {}", progressList.size(), studentId);
            return ResponseEntity.ok(progressList);
        } catch (Exception e) {
            logger.error("Error retrieving progress: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve progress");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}