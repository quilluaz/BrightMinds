package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.entity.Choice;
import JIZAS.BrightMinds.service.ChoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/choices")
public class ChoiceController {
    
    @Autowired
    private ChoiceService choiceService;
    
    // Create a new choice
    @PostMapping
    public ResponseEntity<Choice> createChoice(@RequestBody Choice choice) {
        try {
            Choice createdChoice = choiceService.createChoice(choice);
            return new ResponseEntity<>(createdChoice, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Create a choice for a specific question
    @PostMapping("/question/{questionId}")
    public ResponseEntity<Choice> createChoiceForQuestion(
            @PathVariable Integer questionId, 
            @RequestBody Choice choice) {
        try {
            Choice createdChoice = choiceService.createChoiceForQuestion(questionId, choice);
            return new ResponseEntity<>(createdChoice, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all choices
    @GetMapping
    public ResponseEntity<List<Choice>> getAllChoices() {
        List<Choice> choices = choiceService.getAllChoices();
        return new ResponseEntity<>(choices, HttpStatus.OK);
    }
    
    // Get choice by ID
    @GetMapping("/{choiceId}")
    public ResponseEntity<Choice> getChoiceById(@PathVariable Integer choiceId) {
        Optional<Choice> choice = choiceService.getChoiceById(choiceId);
        return choice.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Get choices by question ID
    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Choice>> getChoicesByQuestionId(@PathVariable Integer questionId) {
        List<Choice> choices = choiceService.getChoicesByQuestionId(questionId);
        return new ResponseEntity<>(choices, HttpStatus.OK);
    }
    
    // Get correct choices by question ID
    @GetMapping("/question/{questionId}/correct")
    public ResponseEntity<List<Choice>> getCorrectChoicesByQuestionId(@PathVariable Integer questionId) {
        List<Choice> choices = choiceService.getCorrectChoicesByQuestionId(questionId);
        return new ResponseEntity<>(choices, HttpStatus.OK);
    }
    
    // Get incorrect choices by question ID
    @GetMapping("/question/{questionId}/incorrect")
    public ResponseEntity<List<Choice>> getIncorrectChoicesByQuestionId(@PathVariable Integer questionId) {
        List<Choice> choices = choiceService.getIncorrectChoicesByQuestionId(questionId);
        return new ResponseEntity<>(choices, HttpStatus.OK);
    }
    
    // Get choices by question ID and correct status
    @GetMapping("/question/{questionId}/status/{isCorrect}")
    public ResponseEntity<List<Choice>> getChoicesByQuestionIdAndCorrectStatus(
            @PathVariable Integer questionId, 
            @PathVariable Boolean isCorrect) {
        List<Choice> choices = choiceService.getChoicesByQuestionIdAndCorrectStatus(questionId, isCorrect);
        return new ResponseEntity<>(choices, HttpStatus.OK);
    }
    
    // Get choices with question details
    @GetMapping("/question/{questionId}/with-details")
    public ResponseEntity<List<Choice>> getChoicesWithQuestionDetails(@PathVariable Integer questionId) {
        try {
            List<Choice> choices = choiceService.getChoicesWithQuestionDetails(questionId);
            return new ResponseEntity<>(choices, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Update choice
    @PutMapping("/{choiceId}")
    public ResponseEntity<Choice> updateChoice(
            @PathVariable Integer choiceId, 
            @RequestBody Choice choice) {
        try {
            choice.setChoiceId(choiceId);
            Choice updatedChoice = choiceService.updateChoice(choice);
            return new ResponseEntity<>(updatedChoice, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete choice by ID
    @DeleteMapping("/{choiceId}")
    public ResponseEntity<Void> deleteChoice(@PathVariable Integer choiceId) {
        try {
            choiceService.deleteChoice(choiceId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete all choices for a question
    @DeleteMapping("/question/{questionId}")
    public ResponseEntity<Void> deleteChoicesByQuestionId(@PathVariable Integer questionId) {
        try {
            choiceService.deleteChoicesByQuestionId(questionId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
