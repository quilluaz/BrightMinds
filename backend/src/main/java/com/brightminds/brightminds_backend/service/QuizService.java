package com.brightminds.brightminds_backend.service;

import com.brightminds.brightminds_backend.model.*;
import com.brightminds.brightminds_backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class QuizService {

    private static final Logger logger = LoggerFactory.getLogger(QuizService.class);

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgressRepository progressRepository; // For saving progress

    @Autowired
    private RewardRepository rewardRepository; // For saving rewards

    // Create a new quiz
    public Quiz createQuiz(Quiz quiz, Long teacherId) {
        logger.info("Creating quiz with topic: {}", quiz.getTopic());
        logger.debug("Teacher ID: {}", teacherId);
        logger.debug("Quiz details: topic={}, gameMode={}, questions={}", 
                    quiz.getTopic(), quiz.getGameMode(), quiz.getQuestions());
        
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> {
                    logger.error("Teacher not found with ID: {}", teacherId);
                    return new RuntimeException("Teacher not found with ID: " + teacherId);
                });
        if (!"TEACHER".equals(teacher.getRole())) {
            logger.error("User with ID {} is not a teacher", teacherId);
            throw new RuntimeException("Only teachers can create quizzes");
        }
        logger.debug("Found teacher: {}", teacher);
        
        quiz.setCreatedBy(teacher);
        logger.debug("Saving quiz to database");
        Quiz savedQuiz = quizRepository.save(quiz);
        logger.debug("Quiz saved successfully: {}", savedQuiz);
        
        return savedQuiz;
    }

    // Get all quizzes
    public List<Quiz> getAllQuizzes() {
        logger.info("Retrieving all quizzes");
        List<Quiz> quizzes = quizRepository.findAll();
        logger.debug("Found {} quizzes", quizzes.size());
        return quizzes;
    }

    // Submit quiz answers and calculate score
    public QuizSubmission submitQuiz(QuizSubmission submission, Long studentId) {
        logger.info("Submitting quiz with ID: {}", submission.getQuizId());
        // Fetch the quiz to calculate the score
        Optional<Quiz> quizOptional = quizRepository.findById(submission.getQuizId());
        if (quizOptional.isEmpty()) {
            logger.error("Quiz not found: {}", submission.getQuizId());
            throw new RuntimeException("Quiz not found: " + submission.getQuizId());
        }

        // Fetch the student
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> {
                    logger.error("Student not found with ID: {}", studentId);
                    return new RuntimeException("Student not found with ID: " + studentId);
                });
        submission.setUser(student);

        Quiz quiz = quizOptional.get();

        // Calculate base score and track streak/allCorrect
        int baseScore = 0;
        int streak = 0;
        int maxStreak = 0;
        boolean allCorrect = true;
        Map<Long, Integer> answers = submission.getAnswers();

        for (Question question : quiz.getQuestions()) {
            Integer selectedOption = answers.get(question.getId());
            if (selectedOption != null && selectedOption == question.getCorrectOption()) {
                baseScore++;
                streak++;
                maxStreak = Math.max(maxStreak, streak);
            } else {
                streak = 0;
                allCorrect = false;
            }
        }

        submission.setStreak(maxStreak);
        submission.setAllCorrect(allCorrect);

        // Calculate total score based on game mode
        int totalScore = baseScore;
        if (quiz.getGameMode() == GameMode.BALLOON) {
            // Balloon Mode: +5 points for every 3 correct answers in a row
            int streakBonuses = maxStreak / 3; // Number of times they got 3 in a row
            totalScore += streakBonuses * 5;
        } else if (quiz.getGameMode() == GameMode.TREASURE_HUNT) {
            // Treasure Hunt Mode: +10 points if all answers are correct
            if (allCorrect) {
                totalScore += 10;
            }
        }

        submission.setScore(totalScore);

        // Save the submission
        logger.debug("Saving quiz submission");
        QuizSubmission savedSubmission = quizSubmissionRepository.save(submission);
        logger.debug("Quiz submission saved: {}", savedSubmission);

        // Save progress
        Progress progress = new Progress();
        progress.setStudent(student);
        progress.setQuiz(quiz);
        progress.setScore(totalScore);
        progress.setCompletedAt(LocalDateTime.now());
        progressRepository.save(progress);
        logger.debug("Progress saved for student ID {} on quiz ID {}", studentId, quiz.getId());

        // Award gems
int gems = 10; // Base reward for completing the quiz
gems += totalScore; // 1 gem per point scored

// Game mode bonuses
if (quiz.getGameMode() == GameMode.BALLOON && maxStreak >= 3) {
    gems += 5; // Bonus for achieving a streak of 3 or more
} else if (quiz.getGameMode() == GameMode.TREASURE_HUNT && allCorrect) {
    gems += 10; // Bonus for getting all answers correct
}

Reward gemReward = new Reward();
gemReward.setStudent(student);
gemReward.setType(Reward.RewardType.GEMS);
gemReward.setGems(gems);
gemReward.setEarnedFor("Completed quiz with ID " + quiz.getId() + " with a score of " + totalScore);
gemReward.setEarnedAt(LocalDateTime.now());
rewardRepository.save(gemReward);
logger.debug("Awarded {} gems to student ID {} for quiz ID {}", gems, studentId, quiz.getId());

// Award a badge if all answers are correct
if (allCorrect) {
    Reward badgeReward = new Reward();
    badgeReward.setStudent(student);
    badgeReward.setType(Reward.RewardType.BADGE);
    badgeReward.setBadgeName("Perfect Score Master");
    badgeReward.setEarnedFor("Achieved a perfect score on quiz with ID " + quiz.getId());
    badgeReward.setEarnedAt(LocalDateTime.now());
    rewardRepository.save(badgeReward);
    logger.debug("Awarded 'Perfect Score Master' badge to student ID {} for quiz ID {}", studentId, quiz.getId());
}
        return savedSubmission;
    }
}