package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Answer;
import JIZAS.BrightMinds.entity.Question;
import JIZAS.BrightMinds.repository.AnswerRepository;
import JIZAS.BrightMinds.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AnswerService {
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    // Create a new answer
    public Answer createAnswer(Answer answer) {
        return answerRepository.save(answer);
    }
    
    // Create an answer for a specific question
    public Answer createAnswerForQuestion(Integer questionId, Answer answer) {
        Optional<Question> questionOpt = questionRepository.findById(questionId);
        if (questionOpt.isPresent()) {
            answer.setQuestion(questionOpt.get());
            return answerRepository.save(answer);
        }
        throw new RuntimeException("Question not found with ID: " + questionId);
    }
    
    // Get all answers
    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }
    
    // Get answer by ID
    public Optional<Answer> getAnswerById(Integer answerId) {
        return answerRepository.findById(answerId);
    }
    
    // Get answers by question ID
    public List<Answer> getAnswersByQuestionId(Integer questionId) {
        return answerRepository.findByQuestionQuestionId(questionId);
    }
    
    // Get answers by question ID ordered by dragdrop position
    public List<Answer> getAnswersByQuestionIdOrdered(Integer questionId) {
        return answerRepository.findByQuestionQuestionIdOrderByDragdropPositionAsc(questionId);
    }
    
    // Get answers with dragdrop position not null
    public List<Answer> getAnswersWithDragdropPosition(Integer questionId) {
        return answerRepository.findByQuestionQuestionIdAndDragdropPositionIsNotNull(questionId);
    }
    
    // Get answers with dragdrop position null
    public List<Answer> getAnswersWithoutDragdropPosition(Integer questionId) {
        return answerRepository.findByQuestionQuestionIdAndDragdropPositionIsNull(questionId);
    }
    
    // Get answer by question ID and dragdrop position
    public Answer getAnswerByQuestionIdAndDragdropPosition(Integer questionId, Integer dragdropPosition) {
        return answerRepository.findByQuestionQuestionIdAndDragdropPosition(questionId, dragdropPosition);
    }
    
    // Get answers with question details
    public List<Answer> getAnswersWithQuestionDetails(Integer questionId) {
        return answerRepository.findAnswersWithQuestionDetails(questionId);
    }
    
    // Update answer
    public Answer updateAnswer(Answer answer) {
        if (answerRepository.existsById(answer.getAnswerId())) {
            return answerRepository.save(answer);
        }
        throw new RuntimeException("Answer not found with ID: " + answer.getAnswerId());
    }
    
    // Delete answer by ID
    public void deleteAnswer(Integer answerId) {
        answerRepository.deleteById(answerId);
    }
    
    // Delete all answers for a question
    public void deleteAnswersByQuestionId(Integer questionId) {
        List<Answer> answers = answerRepository.findByQuestionQuestionId(questionId);
        answerRepository.deleteAll(answers);
    }
    
    // Check if answer exists
    public boolean answerExists(Integer answerId) {
        return answerRepository.existsById(answerId);
    }
}
