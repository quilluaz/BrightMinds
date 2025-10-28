package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Question;
import JIZAS.BrightMinds.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    // Create a new question
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }
    
    // Get all questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
    
    // Get question by ID
    public Optional<Question> getQuestionById(Integer questionId) {
        return questionRepository.findById(questionId);
    }
    
    // Get question with choices and answers by ID
    public Question getQuestionWithChoicesAndAnswers(Integer questionId) {
        return questionRepository.findQuestionWithChoicesAndAnswers(questionId);
    }
    
    // Get questions by scene ID
    public List<Question> getQuestionsBySceneId(Integer sceneId) {
        return questionRepository.findBySceneId(sceneId);
    }
    
    // Get questions by scene ID with choices and answers
    public List<Question> getQuestionsBySceneIdWithChoicesAndAnswers(Integer sceneId) {
        return questionRepository.findQuestionsBySceneIdWithChoicesAndAnswers(sceneId);
    }
    
    // Get questions by type
    public List<Question> getQuestionsByType(Question.QuestionType type) {
        return questionRepository.findByType(type);
    }
    
    // Get questions by scene ID and type
    public List<Question> getQuestionsBySceneIdAndType(Integer sceneId, Question.QuestionType type) {
        return questionRepository.findBySceneIdAndType(sceneId, type);
    }
    
    // Get questions by story ID
    public List<Question> getQuestionsByStoryId(Integer storyId) {
        return questionRepository.findQuestionsByStoryId(storyId);
    }
    
    // Get questions with points greater than specified value
    public List<Question> getQuestionsByPointsGreaterThan(Integer points) {
        return questionRepository.findByPointsGreaterThan(points);
    }
    
    // Update question
    public Question updateQuestion(Question question) {
        if (questionRepository.existsById(question.getQuestionId())) {
            return questionRepository.save(question);
        }
        throw new RuntimeException("Question not found with ID: " + question.getQuestionId());
    }
    
    // Delete question by ID
    public void deleteQuestion(Integer questionId) {
        questionRepository.deleteById(questionId);
    }
    
    // Check if question exists
    public boolean questionExists(Integer questionId) {
        return questionRepository.existsById(questionId);
    }
}
