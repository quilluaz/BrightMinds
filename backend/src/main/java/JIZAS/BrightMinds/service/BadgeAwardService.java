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
    public void awardBadgesForGameCompletion(User user, Story story, Integer score, Integer totalPossibleScore, Double percentage) {
        try {
            System.out.println("BadgeAwardService: Checking badges for user " + user.getUserId() + 
                             ", story " + story.getStoryId() + ", percentage " + percentage);
            
            // Award score-based badges
            awardScoreBasedBadges(user, percentage);
            
            // Award completion-based badges
            awardCompletionBasedBadges(user, story);
            
            // Award performance-based badges
            awardPerformanceBasedBadges(user, story, percentage);
            
            // Award special achievement badges
            awardSpecialAchievementBadges(user, story, percentage);
            
        } catch (Exception e) {
            System.err.println("BadgeAwardService: Error awarding badges: " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception to avoid breaking game completion
        }
    }

    /**
     * Award badges based on score thresholds
     */
    private void awardScoreBasedBadges(User user, Double percentage) {
        // Perfect Score Badge (100%)
        if (percentage >= 100.0) {
            awardBadgeByName(user, "Perfect Score");
        }
        
        // Excellent Performance Badge (90%+)
        if (percentage >= 90.0) {
            awardBadgeByName(user, "Excellent Performance");
        }
        
        // Good Performance Badge (75%+)
        if (percentage >= 75.0) {
            awardBadgeByName(user, "Good Performance");
        }
        
        // Passing Grade Badge (60%+)
        if (percentage >= 60.0) {
            awardBadgeByName(user, "Passing Grade");
        }
    }

    /**
     * Award badges based on completion milestones
     */
    private void awardCompletionBasedBadges(User user, Story story) {
        // First Steps Badge (first completion)
        long totalCompletions = gameAttemptRepository.countByUserUserId(user.getUserId());
        if (totalCompletions == 1) {
            awardBadgeByName(user, "First Steps");
        }
        
        // Story Master Badge (completed this specific story multiple times)
        long storyCompletions = gameAttemptRepository.countByUserUserIdAndStoryStoryId(user.getUserId(), story.getStoryId());
        if (storyCompletions >= 3) {
            awardBadgeByName(user, "Story Master");
        }
        
        // Story Explorer Badge (completed 5 different stories)
        long uniqueStories = gameAttemptRepository.countDistinctStoriesByUser(user.getUserId());
        if (uniqueStories >= 5) {
            awardBadgeByName(user, "Story Explorer");
        }
        
        // Completionist Badge (completed 10 different stories)
        if (uniqueStories >= 10) {
            awardBadgeByName(user, "Completionist");
        }
        
        // Dedicated Learner Badge (completed 20 stories total)
        if (totalCompletions >= 20) {
            awardBadgeByName(user, "Dedicated Learner");
        }
    }

    /**
     * Award badges based on performance metrics
     */
    private void awardPerformanceBasedBadges(User user, Story story, Double percentage) {
        // Consistent Performer Badge (multiple good scores)
        List<GameAttempt> recentAttempts = gameAttemptRepository.findByUserUserIdOrderByEndAttemptDateDesc(user.getUserId());
        if (recentAttempts.size() >= 3) {
            long goodScores = recentAttempts.stream()
                    .limit(3)
                    .filter(attempt -> attempt.getPercentage() != null && attempt.getPercentage() >= 80.0)
                    .count();
            
            if (goodScores >= 3) {
                awardBadgeByName(user, "Consistent Performer");
            }
        }
        
        // Speed Demon Badge (completed quickly with good score)
        if (percentage >= 85.0) {
            List<GameAttempt> storyAttempts = gameAttemptRepository.findByUserUserIdAndStoryStoryIdOrderByEndAttemptDateDesc(user.getUserId(), story.getStoryId());
            if (!storyAttempts.isEmpty()) {
                GameAttempt latestAttempt = storyAttempts.get(0);
                if (latestAttempt.getCompletionTimeSeconds() != null && latestAttempt.getCompletionTimeSeconds() <= 300) { // 5 minutes
                    awardBadgeByName(user, "Speed Demon");
                }
            }
        }
        
        // Perfectionist Badge (100% on 3 different stories)
        long perfectScores = gameAttemptRepository.countPerfectScoresByUser(user.getUserId());
        if (perfectScores >= 3) {
            awardBadgeByName(user, "Perfectionist");
        }
        
        // Bright Mind Badge (95%+ on 5 different stories)
        long excellentScores = gameAttemptRepository.countExcellentScoresByUser(user.getUserId());
        if (excellentScores >= 5) {
            awardBadgeByName(user, "Bright Mind");
        }
    }

    /**
     * Award special achievement badges
     */
    private void awardSpecialAchievementBadges(User user, Story story, Double percentage) {
        // Rising Star Badge (improvement on retry)
        List<GameAttempt> storyAttempts = gameAttemptRepository.findByUserUserIdAndStoryStoryIdOrderByEndAttemptDateDesc(user.getUserId(), story.getStoryId());
        if (storyAttempts.size() >= 2) {
            GameAttempt latest = storyAttempts.get(0);
            GameAttempt previous = storyAttempts.get(1);
            
            if (latest.getPercentage() != null && previous.getPercentage() != null) {
                double improvement = latest.getPercentage() - previous.getPercentage();
                if (improvement >= 20.0) {
                    awardBadgeByName(user, "Rising Star");
                }
            }
        }
        
        // Legend Badge (90%+ average across all stories)
        Double averageScore = gameAttemptRepository.findAverageScoreByUser(user.getUserId());
        if (averageScore != null && averageScore >= 90.0) {
            long totalStories = gameAttemptRepository.countDistinctStoriesByUser(user.getUserId());
            if (totalStories >= 5) { // At least 5 stories completed
                awardBadgeByName(user, "Legend");
            }
        }
    }

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
