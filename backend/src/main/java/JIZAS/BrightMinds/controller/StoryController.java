package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.SceneDTO;
import JIZAS.BrightMinds.dto.StoryDTO;
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
@RequestMapping("/api/stories")
@CrossOrigin(origins = "*")
public class StoryController {
    
    @Autowired
    private StoryService storyService;
    
    @Autowired
    private SceneService sceneService;
    
    @PostMapping
    public ResponseEntity<Story> create(@RequestBody StoryDTO dto) {
        Story created = storyService.create(dto.toEntity());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<StoryDTO>> listAll() {
        List<StoryDTO> list = storyService.listAll().stream().map(StoryDTO::new).collect(Collectors.toList());
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StoryDTO> getById(@PathVariable Integer id) {
        Optional<Story> s = storyService.getById(id);
        return s.map(story -> new ResponseEntity<>(new StoryDTO(story), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Story> update(@PathVariable Integer id, @RequestBody StoryDTO dto) {
        dto.setStoryId(id);
        Story updated = storyService.update(dto.toEntity());
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        storyService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/{id}/scenes")
    public ResponseEntity<List<SceneDTO>> listScenes(@PathVariable Integer id) {
        List<SceneDTO> list = sceneService.listByStory(id).stream().map(SceneDTO::new).collect(Collectors.toList());
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}


