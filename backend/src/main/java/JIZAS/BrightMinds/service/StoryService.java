package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Story;
import JIZAS.BrightMinds.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StoryService {
    
    @Autowired
    private StoryRepository storyRepository;
    
    public Story create(Story story) { return storyRepository.save(story); }
    public List<Story> listAll() { return storyRepository.findAllByOrderByStoryOrderAsc(); }
    public Optional<Story> getById(Integer id) { return storyRepository.findById(id); }
    public Story update(Story story) {
        if (!storyRepository.existsById(story.getStoryId())) {
            throw new RuntimeException("Story not found with ID: " + story.getStoryId());
        }
        return storyRepository.save(story);
    }
    public void delete(Integer id) { storyRepository.deleteById(id); }
}


