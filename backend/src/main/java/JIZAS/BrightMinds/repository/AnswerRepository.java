package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Integer> {
    
    // Find answers by question ID
    List<Answer> findByQuestionQuestionId(Integer questionId);
    
    // Find answers by question ID ordered by dragdrop position
    List<Answer> findByQuestionQuestionIdOrderByDragdropPositionAsc(Integer questionId);
    
    // Find answers with dragdrop position not null
    List<Answer> findByQuestionQuestionIdAndDragdropPositionIsNotNull(Integer questionId);
    
    // Find answers with dragdrop position null
    List<Answer> findByQuestionQuestionIdAndDragdropPositionIsNull(Integer questionId);
    
    // Find answer by question ID and dragdrop position
    Answer findByQuestionQuestionIdAndDragdropPosition(Integer questionId, Integer dragdropPosition);
    
    // Custom query to find answers with question details
    @Query("SELECT a FROM Answer a JOIN FETCH a.question WHERE a.question.questionId = :questionId")
    List<Answer> findAnswersWithQuestionDetails(@Param("questionId") Integer questionId);

    void deleteByQuestion(JIZAS.BrightMinds.entity.Question question);
}
