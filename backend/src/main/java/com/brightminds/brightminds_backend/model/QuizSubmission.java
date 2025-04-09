package com.brightminds.brightminds_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Map;

@Entity
@Table(name = "quiz_submissions")
@Data
public class QuizSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long quizId;      // Reference to the quiz

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;       // Reference to the student who submitted the quiz

    @ElementCollection
    @CollectionTable(name = "submission_answers", joinColumns = @JoinColumn(name = "submission_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "selected_option")
    private Map<Long, Integer> answers; // Map of questionId to selected option index

    @Column(nullable = false)
    private int streak;         // Tracks consecutive correct answers (for Balloon Mode)

    @Column(nullable = false)
    private boolean allCorrect; // True if all answers are correct (for Treasure Hunt Mode)

    @Column(nullable = false)
    private int score;          // Calculated score (including bonuses)
}