package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.SceneDTO;
import JIZAS.BrightMinds.entity.Scene;
import JIZAS.BrightMinds.entity.Story;
import JIZAS.BrightMinds.service.SceneService;
import JIZAS.BrightMinds.service.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scenes")
@CrossOrigin(origins = "*")
public class SceneController {
    
    @Autowired
    private SceneService sceneService;
    
    @Autowired
    private StoryService storyService;
    
    @PostMapping
    public ResponseEntity<Scene> create(@RequestBody SceneDTO dto) {
        Optional<Story> story = storyService.getById(dto.getStoryId());
        if (story.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Scene created = sceneService.create(dto.toEntity(story.get()));
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<SceneDTO>> listAll() {
        List<SceneDTO> list = sceneService.listAll().stream().map(SceneDTO::new).collect(Collectors.toList());
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SceneDTO> getById(@PathVariable Integer id) {
        Optional<Scene> s = sceneService.getById(id);
        return s.map(scene -> new ResponseEntity<>(new SceneDTO(scene), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Scene> update(@PathVariable Integer id, @RequestBody SceneDTO dto) {
        Optional<Story> story = storyService.getById(dto.getStoryId());
        if (story.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Scene entity = dto.toEntity(story.get());
        entity.setSceneId(id);
        Scene updated = sceneService.update(entity);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sceneService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


