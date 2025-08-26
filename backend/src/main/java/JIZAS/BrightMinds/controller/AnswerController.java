package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.entity.Answer;
import JIZAS.BrightMinds.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = "*")
public class AnswerController {
    
    @Autowired
    private AnswerService answerService;
    
    // Create a new answer
    @PostMapping
    public ResponseEntity<Answer> createAnswer(@RequestBody Answer answer) {
        try {
            Answer createdAnswer = answerService.createAnswer(answer);
            return new ResponseEntity<>(createdAnswer, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Create an answer for a specific question
    @PostMapping("/question/{questionId}")
    public ResponseEntity<Answer> createAnswerForQuestion(
            @PathVariable Integer questionId, 
            @RequestBody Answer answer) {
        try {
            Answer createdAnswer = answerService.createAnswerForQuestion(questionId, answer);
            return new ResponseEntity<>(createdAnswer, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all answers
    @GetMapping
    public ResponseEntity<List<Answer>> getAllAnswers() {
        List<Answer> answers = answerService.getAllAnswers();
        return new ResponseEntity<>(answers, HttpStatus.OK);
    }
    
    // Get answer by ID
    @GetMapping("/{answerId}")
    public ResponseEntity<Answer> getAnswerById(@PathVariable Integer answerId) {
        Optional<Answer> answer = answerService.getAnswerById(answerId);
        return answer.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Get answers by question ID
    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Answer>> getAnswersByQuestionId(@PathVariable Integer questionId) {
        List<Answer> answers = answerService.getAnswersByQuestionId(questionId);
        return new ResponseEntity<>(answers, HttpStatus.OK);
    }
    
    // Get answers by question ID ordered by dragdrop position
    @GetMapping("/question/{questionId}/ordered")
    public ResponseEntity<List<Answer>> getAnswersByQuestionIdOrdered(@PathVariable Integer questionId) {
        List<Answer> answers = answerService.getAnswersByQuestionIdOrdered(questionId);
        return new ResponseEntity<>(answers, HttpStatus.OK);
    }
    
    // Get answers with dragdrop position not null
    @GetMapping("/question/{questionId}/with-position")
    public ResponseEntity<List<Answer>> getAnswersWithDragdropPosition(@PathVariable Integer questionId) {
        List<Answer> answers = answerService.getAnswersWithDragdropPosition(questionId);
        return new ResponseEntity<>(answers, HttpStatus.OK);
    }
    
    // Get answers with dragdrop position null
    @GetMapping("/question/{questionId}/without-position")
    public ResponseEntity<List<Answer>> getAnswersWithoutDragdropPosition(@PathVariable Integer questionId) {
        List<Answer> answers = answerService.getAnswersWithoutDragdropPosition(questionId);
        return new ResponseEntity<>(answers, HttpStatus.OK);
    }
    
    // Get answer by question ID and dragdrop position
    @GetMapping("/question/{questionId}/position/{dragdropPosition}")
    public ResponseEntity<Answer> getAnswerByQuestionIdAndDragdropPosition(
            @PathVariable Integer questionId, 
            @PathVariable Integer dragdropPosition) {
        Answer answer = answerService.getAnswerByQuestionIdAndDragdropPosition(questionId, dragdropPosition);
        if (answer != null) {
            return new ResponseEntity<>(answer, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Get answers with question details
    @GetMapping("/question/{questionId}/with-details")
    public ResponseEntity<List<Answer>> getAnswersWithQuestionDetails(@PathVariable Integer questionId) {
        try {
            List<Answer> answers = answerService.getAnswersWithQuestionDetails(questionId);
            return new ResponseEntity<>(answers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Update answer
    @PutMapping("/{answerId}")
    public ResponseEntity<Answer> updateAnswer(
            @PathVariable Integer answerId, 
            @RequestBody Answer answer) {
        try {
            answer.setAnswerId(answerId);
            Answer updatedAnswer = answerService.updateAnswer(answer);
            return new ResponseEntity<>(updatedAnswer, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete answer by ID
    @DeleteMapping("/{answerId}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Integer answerId) {
        try {
            answerService.deleteAnswer(answerId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete all answers for a question
    @DeleteMapping("/question/{questionId}")
    public ResponseEntity<Void> deleteAnswersByQuestionId(@PathVariable Integer questionId) {
        try {
            answerService.deleteAnswersByQuestionId(questionId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
