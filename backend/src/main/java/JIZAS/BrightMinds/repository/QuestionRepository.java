package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    
    // Find questions by scene ID
    List<Question> findBySceneId(Integer sceneId);
    
    // Find questions by type
    List<Question> findByType(Question.QuestionType type);
    
    // Find questions by scene ID and type
    List<Question> findBySceneIdAndType(Integer sceneId, Question.QuestionType type);
    
    // Find questions with points greater than specified value
    List<Question> findByPointsGreaterThan(Integer points);
    
    // Custom query to find questions with their choices and answers
    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.choices LEFT JOIN FETCH q.answers WHERE q.questionId = :questionId")
    Question findQuestionWithChoicesAndAnswers(@Param("questionId") Integer questionId);
    
    // Custom query to find questions by scene ID with choices and answers
    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.choices LEFT JOIN FETCH q.answers WHERE q.sceneId = :sceneId")
    List<Question> findQuestionsBySceneIdWithChoicesAndAnswers(@Param("sceneId") Integer sceneId);
    
    // Custom query to find all questions for a story through scenes
    @Query("SELECT q FROM Question q JOIN Scene s ON q.sceneId = s.sceneId WHERE s.story.storyId = :storyId")
    List<Question> findQuestionsByStoryId(@Param("storyId") Integer storyId);

    void deleteBySceneId(Integer sceneId);
}
