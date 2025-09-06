package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.ProgressRequestDTO;
import JIZAS.BrightMinds.dto.ProgressViewDTO;
import JIZAS.BrightMinds.entity.Progress;
import JIZAS.BrightMinds.entity.Story;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.repository.ProgressRepository;
import JIZAS.BrightMinds.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProgressService {

    private final ProgressRepository repo;
    private final UserRepository userRepo;

    public ProgressService(ProgressRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    public ProgressViewDTO create(ProgressRequestDTO req) {
        Progress p = new Progress();

        // Optional.ifPresent to satisfy the null-check warning
        userRepo.findById(req.getUserId()).ifPresent(p::setUser);
        if (p.getUser() == null) return null;

        Story s = new Story();
        s.setStoryId(req.getStoryId());
        p.setStory(s);

        p.setCurrentScene(req.getCurrentScene());
        p.setScore(req.getScore());
        p.setLastAccessed(LocalDateTime.now());

        return toView(repo.save(p));
    }

    public ProgressViewDTO get(Long id) {
        return repo.findById(id).map(this::toView).orElse(null);
    }

    public List<ProgressViewDTO> list() {
        return repo.findAll().stream().map(this::toView).collect(Collectors.toList());
    }

    public ProgressViewDTO update(Long id, ProgressRequestDTO req) {
        Progress p = repo.findById(id).orElse(null);
        if (p == null) return null;

        if (req.getUserId() != null) {
            userRepo.findById(req.getUserId()).ifPresent(p::setUser);
        }
        if (req.getStoryId() != null) {
            Story s = new Story();
            s.setStoryId(req.getStoryId());
            p.setStory(s);
        }

        p.setCurrentScene(req.getCurrentScene());
        p.setScore(req.getScore());
        p.setLastAccessed(LocalDateTime.now());

        return toView(repo.save(p));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<ProgressViewDTO> getByUserId(Long userId) {
        return repo.findByUser_UserId(userId).stream().map(this::toView).collect(Collectors.toList());
    }

    public List<ProgressViewDTO> getByStoryId(Integer storyId) {
        return repo.findByStory_StoryId(storyId).stream().map(this::toView).collect(Collectors.toList());
    }

    private ProgressViewDTO toView(Progress p) {
        ProgressViewDTO v = new ProgressViewDTO();
        v.setProgressId(p.getProgressId());
        v.setUserId(p.getUser().getUserId());
        v.setStoryId(p.getStory().getStoryId());
        v.setCurrentScene(p.getCurrentScene());
        v.setScore(p.getScore());
        v.setLastAccessed(p.getLastAccessed());
        return v;
    }
}
