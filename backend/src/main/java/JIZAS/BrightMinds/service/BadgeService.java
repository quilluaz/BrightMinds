package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Badge;
import JIZAS.BrightMinds.repository.BadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    public Badge createBadge(Badge badge) {
        return badgeRepository.save(badge);
    }

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }

    public Optional<Badge> getBadgeById(Long badgeId) {
        return badgeRepository.findById(badgeId);
    }

    public Optional<Badge> getBadgeByName(String name) {
        return badgeRepository.findByName(name);
    }

    // Remove getBadgesEarnableAtOrBelowCondition, use getAllBadges and filter in service if needed

    public Badge updateBadge(Badge badge) {
        if (badge.getBadgeId() != null && badgeRepository.existsById(badge.getBadgeId())) {
            return badgeRepository.save(badge);
        }
        throw new RuntimeException("Badge not found with ID: " + badge.getBadgeId());
    }

    public void deleteBadge(Long badgeId) {
        badgeRepository.deleteById(badgeId);
    }
}




