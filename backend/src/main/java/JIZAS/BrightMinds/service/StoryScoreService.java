package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.StoryScoreDTO;
import JIZAS.BrightMinds.entity.Question;
import JIZAS.BrightMinds.entity.Story;
import JIZAS.BrightMinds.entity.UserResponse;
import JIZAS.BrightMinds.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class StoryScoreService {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserResponseService userResponseService;

    @Autowired
    private StoryRepository storyRepository;

    public StoryScoreDTO calculateStoryScore(Long userId, Integer storyId) {
        System.out.println("Calculating story score for user: " + userId + ", story: " + storyId);
        
        // Get the story
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found with ID: " + storyId));

        // Get all questions for this story
        List<Question> questions = questionService.getQuestionsByStoryId(storyId);
        System.out.println("Found " + questions.size() + " questions for story " + storyId);
        
        if (questions.isEmpty()) {
            System.out.println("No questions found, returning empty score");
            return new StoryScoreDTO(storyId, story.getTitle(), 0, 0, 0, 0.0, 0);
        }

        // Get all user responses for this story
        List<UserResponse> userResponses = userResponseService.getByUserAndStory(userId, storyId);
        System.out.println("Found " + userResponses.size() + " user responses");

        // Group responses by question ID to count attempts
        Map<Integer, List<UserResponse>> responsesByQuestion = userResponses.stream()
                .collect(Collectors.groupingBy(response -> response.getQuestion().getQuestionId()));

        int totalQuestions = questions.size();
        int totalPossiblePoints = questions.stream()
                .mapToInt(Question::getPoints)
                .sum();
        
        int earnedPoints = 0;
        int totalWrongAttempts = 0;

        // Calculate score for each question
        for (Question question : questions) {
            List<UserResponse> questionResponses = responsesByQuestion.get(question.getQuestionId());
            
            if (questionResponses == null || questionResponses.isEmpty()) {
                // No response for this question - 0 points
                continue;
            }

            // Find the first correct response
            UserResponse correctResponse = questionResponses.stream()
                    .filter(UserResponse::getIsCorrect)
                    .findFirst()
                    .orElse(null);

            if (correctResponse != null) {
                // Count wrong attempts before the correct answer
                int wrongAttempts = (int) questionResponses.stream()
                        .filter(response -> !response.getIsCorrect())
                        .filter(response -> response.getSubmittedAt().isBefore(correctResponse.getSubmittedAt()))
                        .count();

                // Calculate points: start with full points, subtract 1 for each wrong attempt
                int questionPoints = Math.max(0, question.getPoints() - wrongAttempts);
                earnedPoints += questionPoints;
                totalWrongAttempts += wrongAttempts;
            } else {
                // No correct answer found - count all responses as wrong attempts
                totalWrongAttempts += questionResponses.size();
            }
        }

        // Calculate percentage
        double percentage = totalPossiblePoints > 0 ? 
                (double) earnedPoints / totalPossiblePoints * 100.0 : 0.0;

        System.out.println("Final score calculation: earned=" + earnedPoints + ", total=" + totalPossiblePoints + ", percentage=" + percentage);

        return new StoryScoreDTO(
                storyId,
                story.getTitle(),
                totalQuestions,
                totalPossiblePoints,
                earnedPoints,
                Math.round(percentage * 100.0) / 100.0, // Round to 2 decimal places
                totalWrongAttempts
        );
    }
}

