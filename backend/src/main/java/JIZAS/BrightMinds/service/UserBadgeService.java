package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Badge;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.entity.UserBadge;
import JIZAS.BrightMinds.repository.BadgeRepository;
import JIZAS.BrightMinds.repository.UserBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserBadgeService {

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    public UserBadge createUserBadge(UserBadge userBadge) {
        return userBadgeRepository.save(userBadge);
    }

    public List<UserBadge> getAllUserBadges() {
        return userBadgeRepository.findAll();
    }

    public Optional<UserBadge> getUserBadgeById(Long userBadgeId) {
        return userBadgeRepository.findById(userBadgeId);
    }

    public List<UserBadge> getUserBadgesByUserId(Long userId) {
        return userBadgeRepository.findByUserUserId(userId);
    }

    public List<UserBadge> getUserBadgesWithBadgeByUserId(Long userId) {
        return userBadgeRepository.findWithBadgeByUserId(userId);
    }

    public boolean hasUserEarnedBadge(Long userId, Long badgeId) {
        return userBadgeRepository.existsByUserUserIdAndBadgeBadgeId(userId, badgeId);
    }

    public List<UserBadge> getUserBadgesEarnedBetween(LocalDateTime start, LocalDateTime end) {
        return userBadgeRepository.findByEarnedAtBetween(start, end);
    }

    public UserBadge awardBadgeToUser(User user, Long badgeId) {
        Optional<Badge> badgeOpt = badgeRepository.findById(badgeId);
        if (badgeOpt.isEmpty()) {
            throw new RuntimeException("Badge not found with ID: " + badgeId);
        }
        if (user == null || user.getUserId() == null) {
            throw new RuntimeException("Valid user is required to award a badge");
        }
        if (userBadgeRepository.existsByUserUserIdAndBadgeBadgeId(user.getUserId(), badgeId)) {
            throw new RuntimeException("User already has this badge");
        }
        UserBadge ub = new UserBadge();
        ub.setUser(user);
        ub.setBadge(badgeOpt.get());
        ub.setEarnedAt(LocalDateTime.now());
        return userBadgeRepository.save(ub);
    }

    public UserBadge updateUserBadge(UserBadge userBadge) {
        if (userBadge.getUserBadgeId() != null && userBadgeRepository.existsById(userBadge.getUserBadgeId())) {
            return userBadgeRepository.save(userBadge);
        }
        throw new RuntimeException("UserBadge not found with ID: " + userBadge.getUserBadgeId());
    }

    public void deleteUserBadge(Long userBadgeId) {
        userBadgeRepository.deleteById(userBadgeId);
    }
}



