package com.brightminds.brightminds_backend.controller;

import com.brightminds.brightminds_backend.model.Quiz;
import com.brightminds.brightminds_backend.model.QuizSubmission;
import com.brightminds.brightminds_backend.service.QuizService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);

    @Autowired
    private QuizService quizService;

    @PostMapping("/create")
public ResponseEntity<Quiz> createQuiz(@Valid @RequestBody Quiz quiz, @RequestParam Long teacherId) {
    logger.info("Creating quiz with topic: {}", quiz.getTopic());
    try {
        Quiz createdQuiz = quizService.createQuiz(quiz, teacherId);
        return ResponseEntity.ok(createdQuiz);
    } catch (Exception e) {
        logger.error("Error creating quiz: {}", e.getMessage(), e);
        return ResponseEntity.badRequest().body(null);
    }
}

    @GetMapping("/list")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        try {
            List<Quiz> quizzes = quizService.getAllQuizzes();
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            logger.error("Error retrieving quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizSubmission> submitQuiz(@RequestBody QuizSubmission submission, @RequestParam Long studentId) {
        try {
            QuizSubmission submitted = quizService.submitQuiz(submission, studentId);
            return ResponseEntity.ok(submitted);
        } catch (Exception e) {
            logger.error("Error submitting quiz: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }
}