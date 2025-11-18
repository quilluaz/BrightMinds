package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.*;
import JIZAS.BrightMinds.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BadgeAwardService {

    @Autowired
    private UserBadgeService userBadgeService;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private GameAttemptRepository gameAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Award badges based on game completion performance
     */
    public void awardBadgesForGameCompletion(User user, Story story, Integer score, Integer totalPossibleScore, Double percentage, Integer completionTimeSeconds) {
        try {
            System.out.println("BadgeAwardService: Checking badges for user " + user.getUserId() + 
                             ", story " + story.getStoryId() + ", percentage " + percentage);
            List<Badge> allBadges = badgeRepository.findAll();
            for (Badge badge : allBadges) {
                String condJson = badge.getConditionJson();
                if (condJson == null || condJson.isEmpty()) continue;
                try {
                    // Parse JSON condition
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    @SuppressWarnings("unchecked")
                    java.util.Map<String, Object> cond = mapper.readValue(condJson, java.util.Map.class);
                    String type = (String) cond.get("type");
                    String storyTitle = cond.containsKey("story") ? (String) cond.get("story") : null;
                    if (storyTitle != null && !storyTitle.equals(story.getTitle())) continue;
                    if (type != null) {
                        if (type.equals("score")) {
                            int value = cond.containsKey("value") ? (int) cond.get("value") : 0;
                            if (percentage != null && percentage >= value) {
                                awardBadgeByName(user, badge.getName());
                            }
                        } else if (type.equals("score_time")) {
                            int timeMin = cond.containsKey("time_minutes") ? (int) cond.get("time_minutes") : 0;
                            if (completionTimeSeconds != null && completionTimeSeconds <= timeMin * 60) {
                                awardBadgeByName(user, badge.getName());
                            }
                        }
                        // Add more types as needed
                    }
                } catch (Exception e) {
                    System.err.println("BadgeAwardService: Error parsing badge condition for badge " + badge.getName() + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("BadgeAwardService: Error awarding badges: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Award badges based on score thresholds
     */

    /**
     * Award a badge to a user by badge name
     */
    private void awardBadgeByName(User user, String badgeName) {
        try {
            Optional<Badge> badgeOpt = badgeRepository.findByName(badgeName);
            if (badgeOpt.isPresent()) {
                Badge badge = badgeOpt.get();
                if (!userBadgeService.hasUserEarnedBadge(user.getUserId(), badge.getBadgeId())) {
                    userBadgeService.awardBadgeToUser(user, badge.getBadgeId());
                    System.out.println("BadgeAwardService: Awarded badge '" + badgeName + "' to user " + user.getUserId());
                } else {
                    System.out.println("BadgeAwardService: User " + user.getUserId() + " already has badge '" + badgeName + "'");
                }
            } else {
                System.out.println("BadgeAwardService: Badge '" + badgeName + "' not found in database");
            }
        } catch (Exception e) {
            System.err.println("BadgeAwardService: Error awarding badge '" + badgeName + "': " + e.getMessage());
        }
    }

    /**
     * Check and award badges for a specific user (useful for retroactive badge awarding)
     */
    public void checkAndAwardRetroactiveBadges(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            List<GameAttempt> allAttempts = gameAttemptRepository.findByUserUserIdOrderByEndAttemptDateDesc(userId);
            
            if (allAttempts.isEmpty()) {
                System.out.println("BadgeAwardService: No attempts found for user " + userId);
                return;
            }
            
            System.out.println("BadgeAwardService: Checking retroactive badges for user " + userId + " with " + allAttempts.size() + " attempts");
            
            // Award completion-based badges
            long totalCompletions = allAttempts.size();
            long uniqueStories = allAttempts.stream()
                    .map(attempt -> attempt.getStory().getStoryId())
                    .distinct()
                    .count();
            
            if (totalCompletions >= 1) awardBadgeByName(user, "First Steps");
            if (uniqueStories >= 5) awardBadgeByName(user, "Story Explorer");
            if (uniqueStories >= 10) awardBadgeByName(user, "Completionist");
            if (totalCompletions >= 20) awardBadgeByName(user, "Dedicated Learner");
            
            // Award performance-based badges
            long perfectScores = allAttempts.stream()
                    .filter(attempt -> attempt.getPercentage() != null && attempt.getPercentage() >= 100.0)
                    .count();
            long excellentScores = allAttempts.stream()
                    .filter(attempt -> attempt.getPercentage() != null && attempt.getPercentage() >= 95.0)
                    .count();
            
            if (perfectScores >= 3) awardBadgeByName(user, "Perfectionist");
            if (excellentScores >= 5) awardBadgeByName(user, "Bright Mind");
            
            // Check for Legend badge
            Double averageScore = allAttempts.stream()
                    .filter(attempt -> attempt.getPercentage() != null)
                    .mapToDouble(GameAttempt::getPercentage)
                    .average()
                    .orElse(0.0);
            
            if (averageScore >= 90.0 && uniqueStories >= 5) {
                awardBadgeByName(user, "Legend");
            }
            
            System.out.println("BadgeAwardService: Retroactive badge check completed for user " + userId);
            
        } catch (Exception e) {
            System.err.println("BadgeAwardService: Error checking retroactive badges: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
