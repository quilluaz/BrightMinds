package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.*;
import JIZAS.BrightMinds.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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
            
            // Award score-based badges (Generalized)
            awardScoreBasedBadges(user, percentage);
            
            // Award completion-based badges (Generalized)
            awardCompletionBasedBadges(user, story);
            
            // Award performance-based badges (Generalized)
            awardPerformanceBasedBadges(user, story, percentage);
            
            // Award story-specific badges
            awardStorySpecificBadges(user, story, percentage, score);
            
        } catch (Exception e) {
            System.err.println("BadgeAwardService: Error awarding badges: " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception to avoid breaking game completion
        }
    }

    /**
     * Award badges based on score thresholds (Generalized)
     */
    private void awardScoreBasedBadges(User user, Double percentage) {
        // Super Story Smasher (100% on any story)
        if (percentage >= 100.0) {
            awardBadgeByName(user, "Super Story Smasher");
        }
        
        // Bouncy Brainiac (90% on any story)
        if (percentage >= 90.0) {
            awardBadgeByName(user, "Bouncy Brainiac");
        }
        
        // Goofy Zero Guru (0%)
        if (percentage == 0.0) {
            awardBadgeByName(user, "Goofy Zero Guru");
        }
    }

    /**
     * Award badges based on completion milestones (Generalized)
     */
    private void awardCompletionBasedBadges(User user, Story story) {
        // Quest Crusader (Complete all 3 stories)
        long uniqueStories = gameAttemptRepository.countDistinctStoriesByUser(user.getUserId());
        if (uniqueStories >= 3) {
            awardBadgeByName(user, "Quest Crusader");
        }
        
        // Jungle Jumper (Complete 5 stories total)
        long totalCompletions = gameAttemptRepository.countByUserUserId(user.getUserId());
        if (totalCompletions >= 5) {
            awardBadgeByName(user, "Jungle Jumper");
        }
    }

    /**
     * Award badges based on performance metrics (Generalized)
     */
    private void awardPerformanceBasedBadges(User user, Story story, Double percentage) {
        // Story Streak Star (2 stories in a row >= 85%)
        List<GameAttempt> recentAttempts = gameAttemptRepository.findByUserUserIdOrderByEndAttemptDateDesc(
                user.getUserId(), PageRequest.of(0, 2)).getContent();
        
        if (recentAttempts.size() >= 2) {
            boolean streak = recentAttempts.stream()
                    .allMatch(a -> a.getPercentage() != null && a.getPercentage() >= 85.0);
            if (streak) {
                awardBadgeByName(user, "Story Streak Star");
            }
        }
        
        // Speedy Story Sprinter (Any story < 7 mins with >= 80%)
        // Note: We need the current attempt's time. 
        // We will fetch the latest attempt for this story.
        List<GameAttempt> specificAttempts = gameAttemptRepository.findByUserUserIdAndStoryStoryIdOrderByEndAttemptDateDesc(
                user.getUserId(), story.getStoryId());
        
        if (!specificAttempts.isEmpty()) {
            GameAttempt latest = specificAttempts.get(0);
            Integer duration = latest.getCompletionTimeSeconds();
            
            if (percentage >= 80.0 && duration != null && duration <= (7 * 60)) {
                 awardBadgeByName(user, "Speedy Story Sprinter");
            }
            
            // Turtle Tickler (> 20 mins)
            if (duration != null && duration >= (20 * 60)) {
                awardBadgeByName(user, "Turtle Tickler");
            }
        }
        
        // Retry Rocketeer (Improve by 15% on retry)
        // Wobbly Wanderer (Lower score on retry)
        if (specificAttempts.size() >= 2) {
            GameAttempt current = specificAttempts.get(0);
            GameAttempt previous = specificAttempts.get(1);
            
            if (current.getPercentage() != null && previous.getPercentage() != null) {
                double diff = current.getPercentage() - previous.getPercentage();
                
                if (diff >= 15.0) {
                    awardBadgeByName(user, "Retry Rocketeer");
                }
                
                if (diff < 0) {
                    awardBadgeByName(user, "Wobbly Wanderer");
                }
            }
        }
    }

    /**
     * Award badges for specific stories
     */
    private void awardStorySpecificBadges(User user, Story story, Double percentage, Integer score) {
        String title = story.getTitle();
        if (title == null) return;
        
        List<GameAttempt> attempts = gameAttemptRepository.findByUserUserIdAndStoryStoryIdOrderByEndAttemptDateDesc(
                user.getUserId(), story.getStoryId());
        GameAttempt latest = attempts.isEmpty() ? null : attempts.get(0);
        Integer duration = latest != null ? latest.getCompletionTimeSeconds() : null;

        // --- The Secret of the Amulet ---
        if (title.equalsIgnoreCase("The Secret of the Amulet")) {
            // Amulet Ace (100%)
            if (percentage >= 100.0) {
                awardBadgeByName(user, "Amulet Ace");
            }
            
            // Plains Pathfinder (< 10 mins)
            if (duration != null && duration < (10 * 60)) {
                awardBadgeByName(user, "Plains Pathfinder");
            }
            
            // Village Victory (Improve score on any retry)
            if (attempts.size() >= 2) {
                GameAttempt prev = attempts.get(1);
                if (latest != null && prev.getPercentage() != null && latest.getPercentage() > prev.getPercentage()) {
                    awardBadgeByName(user, "Village Victory");
                }
            }
            
            // Early Amulet Explorer ("first week" - mocked as always true or logic if needed, 
            // but for now we'll just check if it's their first completion of this story)
            // Implementation: Simple check if this is the first time they played it.
            if (attempts.size() == 1) {
                awardBadgeByName(user, "Early Amulet Explorer");
            }
        }
        
        // --- Leah's Scrapbook ---
        if (title.equalsIgnoreCase("Leah's Scrapbook")) {
            // Scrapbook Sorcerer (90%+)
            if (percentage >= 90.0) {
                awardBadgeByName(user, "Scrapbook Sorcerer");
            }
            
            // Speedy Sorter (< 5 mins)
            if (duration != null && duration < (5 * 60)) {
                awardBadgeByName(user, "Speedy Sorter");
            }
            
            // Mineral Maestro (Every mineral question right -> 100%)
            // Assuming 100% score implies getting all mineral questions right for now
            if (percentage >= 100.0) {
                awardBadgeByName(user, "Mineral Maestro");
            }
        }
        
        // --- Hiraya's Heroes ---
        if (title.equalsIgnoreCase("Hiraya's Heroes")) {
            // Hero Historian (95%+)
            if (percentage >= 95.0) {
                awardBadgeByName(user, "Hero Historian");
            }
            
            // Auntie's Ally (Complete 3 times)
            if (attempts.size() >= 3) {
                awardBadgeByName(user, "Auntie's Ally");
            }
            
            // Sequence Superstar (Perfect sequence -> 100%)
            if (percentage >= 100.0) {
                awardBadgeByName(user, "Sequence Superstar");
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
    /**
     * Check and award badges for a specific user (retroactive)
     * Iterates through all past attempts and re-runs eligibility checks.
     */
    public void checkAndAwardRetroactiveBadges(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<GameAttempt> allAttempts = gameAttemptRepository.findByUserUserIdOrderByEndAttemptDateDesc(userId, org.springframework.data.domain.Pageable.unpaged()).getContent();

        System.out.println("BadgeAwardService: Running retroactive check for user " + userId + " on " + allAttempts.size() + " attempts.");

        // Iterate through all attempts to catch per-attempt badges (Score, Time, Story-Specific)
        for (GameAttempt attempt : allAttempts) {
            if (attempt.getStory() == null) continue;
            
            // We reuse the existing logic. 
            // NOTE: 'Streak' logic in awardPerformanceBasedBadges relies on "current most recent", 
            // so historical streaks might not trigger if they aren't currently the most recent.
            // But per-attempt badges (100% score, speed runs) will work perfectly.
            awardBadgesForGameCompletion(
                user, 
                attempt.getStory(), 
                attempt.getScore(), 
                attempt.getTotalPossibleScore(), 
                attempt.getPercentage()
            );
        }
        
        // Also explicitly check global counters (quests, total stories) just in case
        // (Though awardBadgesForGameCompletion calls awardCompletionBasedBadges, so this is covered)
    }


    /**
     * Check and award badges for ALL users (retroactive)
     */
    public void checkAndAwardRetroactiveBadgesForAll() {
        List<User> allUsers = userRepository.findAll();
        System.out.println("BadgeAwardService: Running global retroactive check for " + allUsers.size() + " users.");
        
        for (User user : allUsers) {
            checkAndAwardRetroactiveBadges(user.getUserId());
        }
    }
}
