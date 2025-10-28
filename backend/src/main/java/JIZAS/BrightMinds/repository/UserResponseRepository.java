package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.UserResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserResponseRepository extends JpaRepository<UserResponse, Long> {
    List<UserResponse> findByUserUserId(Long userId);
    List<UserResponse> findByQuestionQuestionId(Integer questionId);
    List<UserResponse> findByUserUserIdAndQuestionQuestionId(Long userId, Integer questionId);
    
    // Custom query to find user responses for questions in a specific story
    @Query("SELECT ur FROM UserResponse ur JOIN ur.question q JOIN Scene s ON q.sceneId = s.sceneId WHERE ur.user.userId = :userId AND s.story.storyId = :storyId")
    List<UserResponse> findByUserAndStory(@Param("userId") Long userId, @Param("storyId") Integer storyId);
}


