package com.brightminds.brightminds_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "rewards")
@Data
public class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    private RewardType type; // GEMS or BADGE

    private int gems; // Only applicable if type is GEMS

    private String badgeName; // Only applicable if type is BADGE

    private String earnedFor;

    private LocalDateTime earnedAt;

    public enum RewardType {
        GEMS, BADGE
    }
}