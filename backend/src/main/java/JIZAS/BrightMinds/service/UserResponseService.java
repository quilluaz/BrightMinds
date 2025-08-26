package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Question;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.entity.UserResponse;
import JIZAS.BrightMinds.repository.QuestionRepository;
import JIZAS.BrightMinds.repository.UserRepository;
import JIZAS.BrightMinds.repository.UserResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserResponseService {

    @Autowired
    private UserResponseRepository userResponseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public UserResponse create(UserResponse response, Long userId, Integer questionId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Question> questionOpt = questionRepository.findById(questionId);
        if (userOpt.isEmpty() || questionOpt.isEmpty()) {
            throw new RuntimeException("User or Question not found");
        }
        response.setUser(userOpt.get());
        response.setQuestion(questionOpt.get());
        if (response.getSubmittedAt() == null) {
            response.setSubmittedAt(LocalDateTime.now());
        }
        return userResponseRepository.save(response);
    }

    public List<UserResponse> getAll() {
        return userResponseRepository.findAll();
    }

    public Optional<UserResponse> getById(Long responseId) {
        return userResponseRepository.findById(responseId);
    }

    public List<UserResponse> getByUserId(Long userId) {
        return userResponseRepository.findByUserUserId(userId);
    }

    public List<UserResponse> getByQuestionId(Integer questionId) {
        return userResponseRepository.findByQuestionQuestionId(questionId);
    }

    public List<UserResponse> getByUserAndQuestion(Long userId, Integer questionId) {
        return userResponseRepository.findByUserUserIdAndQuestionQuestionId(userId, questionId);
    }

    public UserResponse update(Long id, UserResponse updated) {
        return userResponseRepository.findById(id)
                .map(existing -> {
                    existing.setGivenAnswer(updated.getGivenAnswer());
                    existing.setIsCorrect(updated.getIsCorrect());
                    existing.setSubmittedAt(updated.getSubmittedAt() != null ? updated.getSubmittedAt() : existing.getSubmittedAt());
                    return userResponseRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("UserResponse not found with ID: " + id));
    }

    public void delete(Long id) {
        userResponseRepository.deleteById(id);
    }
}


