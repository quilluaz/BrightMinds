package com.brightminds.brightminds_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "questions")
@Data
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Question text cannot be blank")
    @Column(nullable = false)
    private String text;        // e.g., "Sino ang sumulat ng 'Noli Me Tangere'?"

    @NotNull(message = "Options cannot be null")
    @Size(min = 2, message = "At least 2 options are required")
    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text") // Changed from "option" to "option_text"
    private List<String> options; // e.g., ["Andres Bonifacio", "Jose Rizal", "Emilio Aguinaldo", "Gregorio del Pilar"]

    @Column(nullable = false)
    private int correctOption;  // Index of the correct option (e.g., 1 for "Jose Rizal")
}