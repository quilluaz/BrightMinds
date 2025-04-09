package com.brightminds.brightminds_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import jakarta.validation.Valid;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Topic cannot be blank")
    @Column(nullable = false)
    private String topic;       // e.g., "Mga Bayani ng Pilipinas"

    @NotNull(message = "Questions cannot be null")
    @Valid // Enable cascading validation
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "quiz_id")
    private List<Question> questions;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;   // Reference to the teacher who created the quiz

    @NotNull(message = "GameMode cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameMode gameMode;  // Balloon or Treasure Hunt
}