package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Choice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Integer> {
    
    // Find choices by question ID
    List<Choice> findByQuestionQuestionId(Integer questionId);
    
    // Find correct choices by question ID
    List<Choice> findByQuestionQuestionIdAndIsCorrectTrue(Integer questionId);
    
    // Find incorrect choices by question ID
    List<Choice> findByQuestionQuestionIdAndIsCorrectFalse(Integer questionId);
    
    // Find choices by question ID and correct status
    List<Choice> findByQuestionQuestionIdAndIsCorrect(Integer questionId, Boolean isCorrect);
    
    // Custom query to find choices with question details
    @Query("SELECT c FROM Choice c JOIN FETCH c.question WHERE c.question.questionId = :questionId")
    List<Choice> findChoicesWithQuestionDetails(@Param("questionId") Integer questionId);
}
