package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.GameAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GameAttemptRepository extends JpaRepository<GameAttempt, Long> {

    /**
     * Find all attempts by a specific user, ordered by end attempt date (newest first)
     */
    List<GameAttempt> findByUserUserIdOrderByEndAttemptDateDesc(Long userId);

    /**
     * Find all attempts by a specific user with pagination, ordered by end attempt date (newest first)
     */
    Page<GameAttempt> findByUserUserIdOrderByEndAttemptDateDesc(Long userId, Pageable pageable);

    /**
     * Find all attempts for a specific story by a user, ordered by end attempt date (newest first)
     */
    List<GameAttempt> findByUserUserIdAndStoryStoryIdOrderByEndAttemptDateDesc(Long userId, Integer storyId);

    /**
     * Find the best attempt (highest score) for a specific story by a user
     */
    @Query("SELECT ga FROM GameAttempt ga WHERE ga.user.userId = :userId AND ga.story.storyId = :storyId ORDER BY ga.score DESC, ga.endAttemptDate DESC")
    List<GameAttempt> findBestAttemptByUserAndStory(@Param("userId") Long userId, @Param("storyId") Integer storyId);

    /**
     * Find the latest attempt for a specific story by a user
     */
    @Query("SELECT ga FROM GameAttempt ga WHERE ga.user.userId = :userId AND ga.story.storyId = :storyId ORDER BY ga.endAttemptDate DESC")
    List<GameAttempt> findLatestAttemptByUserAndStory(@Param("userId") Long userId, @Param("storyId") Integer storyId);

    /**
     * Count total attempts by a user for a specific story
     */
    long countByUserUserIdAndStoryStoryId(Long userId, Integer storyId);

    /**
     * Count total attempts by a user across all stories
     */
    long countByUserUserId(Long userId);

    /**
     * Find attempts within a date range for a user
     */
    List<GameAttempt> findByUserUserIdAndEndAttemptDateBetweenOrderByEndAttemptDateDesc(
            Long userId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find attempts with score above a threshold for a user
     */
    List<GameAttempt> findByUserUserIdAndScoreGreaterThanEqualOrderByEndAttemptDateDesc(Long userId, Integer minScore);

    /**
     * Get average score for a user across all attempts
     */
    @Query("SELECT AVG(ga.score) FROM GameAttempt ga WHERE ga.user.userId = :userId")
    Double findAverageScoreByUser(@Param("userId") Long userId);

    /**
     * Get average score for a user for a specific story
     */
    @Query("SELECT AVG(ga.score) FROM GameAttempt ga WHERE ga.user.userId = :userId AND ga.story.storyId = :storyId")
    Double findAverageScoreByUserAndStory(@Param("userId") Long userId, @Param("storyId") Integer storyId);

    /**
     * Find attempts by user with pagination and optional story filter
     */
    @Query("SELECT ga FROM GameAttempt ga WHERE ga.user.userId = :userId " +
           "AND (:storyId IS NULL OR ga.story.storyId = :storyId) " +
           "ORDER BY ga.endAttemptDate DESC")
    Page<GameAttempt> findByUserWithOptionalStoryFilter(@Param("userId") Long userId, 
                                                       @Param("storyId") Integer storyId, 
                                                       Pageable pageable);
}
