package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.UserResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserResponseRepository extends JpaRepository<UserResponse, Long> {
    List<UserResponse> findByUserUserId(Long userId);
    List<UserResponse> findByQuestionQuestionId(Integer questionId);
    List<UserResponse> findByUserUserIdAndQuestionQuestionId(Long userId, Integer questionId);
}


