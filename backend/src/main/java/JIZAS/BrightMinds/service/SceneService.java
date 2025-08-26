package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Scene;
import JIZAS.BrightMinds.repository.SceneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SceneService {
    
    @Autowired
    private SceneRepository sceneRepository;
    
    public Scene create(Scene scene) { return sceneRepository.save(scene); }
    public List<Scene> listAll() { return sceneRepository.findAll(); }
    public Optional<Scene> getById(Integer id) { return sceneRepository.findById(id); }
    public List<Scene> listByStory(Integer storyId) { return sceneRepository.findByStory_StoryIdOrderBySceneOrderAsc(storyId); }
    public Scene update(Scene scene) {
        if (!sceneRepository.existsById(scene.getSceneId())) {
            throw new RuntimeException("Scene not found with ID: " + scene.getSceneId());
        }
        return sceneRepository.save(scene);
    }
    public void delete(Integer id) { sceneRepository.deleteById(id); }
}


