package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.entity.UserResponse;
import JIZAS.BrightMinds.service.UserResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-responses")
public class UserResponseController {

    @Autowired
    private UserResponseService userResponseService;

    @PostMapping("/user/{userId}/question/{questionId}")
    public ResponseEntity<UserResponse> create(
            @PathVariable Long userId,
            @PathVariable Integer questionId,
            @RequestBody UserResponse body) {
        try {
            UserResponse created = userResponseService.create(body, userId, questionId);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAll() {
        return new ResponseEntity<>(userResponseService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        Optional<UserResponse> res = userResponseService.getById(id);
        return res.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserResponse>> getByUser(@PathVariable Long userId) {
        return new ResponseEntity<>(userResponseService.getByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<UserResponse>> getByQuestion(@PathVariable Integer questionId) {
        return new ResponseEntity<>(userResponseService.getByQuestionId(questionId), HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/question/{questionId}")
    public ResponseEntity<List<UserResponse>> getByUserAndQuestion(
            @PathVariable Long userId,
            @PathVariable Integer questionId) {
        return new ResponseEntity<>(userResponseService.getByUserAndQuestion(userId, questionId), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @RequestBody UserResponse body) {
        try {
            return new ResponseEntity<>(userResponseService.update(id, body), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            userResponseService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}


