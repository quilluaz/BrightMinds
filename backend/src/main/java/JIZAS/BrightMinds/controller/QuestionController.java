package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.entity.Question;
import JIZAS.BrightMinds.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {
    
    @Autowired
    private QuestionService questionService;
    
    // Create a new question
    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        try {
            Question createdQuestion = questionService.createQuestion(question);
            return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all questions
    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }
    
    // Get question by ID
    @GetMapping("/{questionId}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Integer questionId) {
        Optional<Question> question = questionService.getQuestionById(questionId);
        return question.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Get question with choices and answers by ID
    @GetMapping("/{questionId}/full")
    public ResponseEntity<Question> getQuestionWithChoicesAndAnswers(@PathVariable Integer questionId) {
        try {
            Question question = questionService.getQuestionWithChoicesAndAnswers(questionId);
            return new ResponseEntity<>(question, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Get questions by scene ID
    @GetMapping("/scene/{sceneId}")
    public ResponseEntity<List<Question>> getQuestionsBySceneId(@PathVariable Integer sceneId) {
        List<Question> questions = questionService.getQuestionsBySceneId(sceneId);
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }
    
    // Get questions by scene ID with choices and answers
    @GetMapping("/scene/{sceneId}/full")
    public ResponseEntity<List<Question>> getQuestionsBySceneIdWithChoicesAndAnswers(@PathVariable Integer sceneId) {
        try {
            List<Question> questions = questionService.getQuestionsBySceneIdWithChoicesAndAnswers(sceneId);
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get questions by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Question>> getQuestionsByType(@PathVariable String type) {
        try {
            Question.QuestionType questionType = Question.QuestionType.valueOf(type.toUpperCase());
            List<Question> questions = questionService.getQuestionsByType(questionType);
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get questions by scene ID and type
    @GetMapping("/scene/{sceneId}/type/{type}")
    public ResponseEntity<List<Question>> getQuestionsBySceneIdAndType(
            @PathVariable Integer sceneId, 
            @PathVariable String type) {
        try {
            Question.QuestionType questionType = Question.QuestionType.valueOf(type.toUpperCase());
            List<Question> questions = questionService.getQuestionsBySceneIdAndType(sceneId, questionType);
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get questions with points greater than specified value
    @GetMapping("/points/{points}")
    public ResponseEntity<List<Question>> getQuestionsByPointsGreaterThan(@PathVariable Integer points) {
        List<Question> questions = questionService.getQuestionsByPointsGreaterThan(points);
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }
    
    // Update question
    @PutMapping("/{questionId}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Integer questionId, 
            @RequestBody Question question) {
        try {
            question.setQuestionId(questionId);
            Question updatedQuestion = questionService.updateQuestion(question);
            return new ResponseEntity<>(updatedQuestion, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete question by ID
    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Integer questionId) {
        try {
            questionService.deleteQuestion(questionId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
