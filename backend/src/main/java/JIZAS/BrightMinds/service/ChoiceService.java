package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Choice;
import JIZAS.BrightMinds.entity.Question;
import JIZAS.BrightMinds.repository.ChoiceRepository;
import JIZAS.BrightMinds.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ChoiceService {
    
    @Autowired
    private ChoiceRepository choiceRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    // Create a new choice
    public Choice createChoice(Choice choice) {
        return choiceRepository.save(choice);
    }
    
    // Create a choice for a specific question
    public Choice createChoiceForQuestion(Integer questionId, Choice choice) {
        Optional<Question> questionOpt = questionRepository.findById(questionId);
        if (questionOpt.isPresent()) {
            choice.setQuestion(questionOpt.get());
            return choiceRepository.save(choice);
        }
        throw new RuntimeException("Question not found with ID: " + questionId);
    }
    
    // Get all choices
    public List<Choice> getAllChoices() {
        return choiceRepository.findAll();
    }
    
    // Get choice by ID
    public Optional<Choice> getChoiceById(Integer choiceId) {
        return choiceRepository.findById(choiceId);
    }
    
    // Get choices by question ID
    public List<Choice> getChoicesByQuestionId(Integer questionId) {
        return choiceRepository.findByQuestionQuestionId(questionId);
    }
    
    // Get correct choices by question ID
    public List<Choice> getCorrectChoicesByQuestionId(Integer questionId) {
        return choiceRepository.findByQuestionQuestionIdAndIsCorrectTrue(questionId);
    }
    
    // Get incorrect choices by question ID
    public List<Choice> getIncorrectChoicesByQuestionId(Integer questionId) {
        return choiceRepository.findByQuestionQuestionIdAndIsCorrectFalse(questionId);
    }
    
    // Get choices by question ID and correct status
    public List<Choice> getChoicesByQuestionIdAndCorrectStatus(Integer questionId, Boolean isCorrect) {
        return choiceRepository.findByQuestionQuestionIdAndIsCorrect(questionId, isCorrect);
    }
    
    // Get choices with question details
    public List<Choice> getChoicesWithQuestionDetails(Integer questionId) {
        return choiceRepository.findChoicesWithQuestionDetails(questionId);
    }
    
    // Update choice
    public Choice updateChoice(Choice choice) {
        if (choiceRepository.existsById(choice.getChoiceId())) {
            return choiceRepository.save(choice);
        }
        throw new RuntimeException("Choice not found with ID: " + choice.getChoiceId());
    }
    
    // Delete choice by ID
    public void deleteChoice(Integer choiceId) {
        choiceRepository.deleteById(choiceId);
    }
    
    // Delete all choices for a question
    public void deleteChoicesByQuestionId(Integer questionId) {
        List<Choice> choices = choiceRepository.findByQuestionQuestionId(questionId);
        choiceRepository.deleteAll(choices);
    }
    
    // Check if choice exists
    public boolean choiceExists(Integer choiceId) {
        return choiceRepository.existsById(choiceId);
    }
}
