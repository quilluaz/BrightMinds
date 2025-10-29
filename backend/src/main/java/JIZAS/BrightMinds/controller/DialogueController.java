package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.DialogueDTO;
import JIZAS.BrightMinds.entity.Asset;
import JIZAS.BrightMinds.entity.Dialogue;
import JIZAS.BrightMinds.entity.Scene;
import JIZAS.BrightMinds.service.AssetService;
import JIZAS.BrightMinds.service.DialogueService;
import JIZAS.BrightMinds.service.SceneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dialogues")
public class DialogueController {

    @Autowired
    private DialogueService dialogueService;

    @Autowired
    private SceneService sceneService;

    @Autowired
    private AssetService assetService;

    @PostMapping
    public ResponseEntity<DialogueDTO> create(@RequestBody DialogueDTO dto) {
        Optional<Scene> scene = sceneService.getById(dto.getSceneId());
        if (scene.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Asset voice = null;
        if (dto.getVoiceAssetId() != null) {
            Optional<Asset> a = assetService.get(dto.getVoiceAssetId());
            if (a.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            voice = a.get();
        }

        Dialogue created = dialogueService.create(dto.toEntity(scene.get(), voice));
        return new ResponseEntity<>(new DialogueDTO(created), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DialogueDTO>> list() {
        List<DialogueDTO> list = dialogueService.listAll().stream().map(DialogueDTO::new).collect(Collectors.toList());
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DialogueDTO> get(@PathVariable UUID id) {
        Optional<Dialogue> d = dialogueService.getById(id);
        return d.map(value -> new ResponseEntity<>(new DialogueDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/scene/{sceneId}")
    public ResponseEntity<List<DialogueDTO>> listByScene(@PathVariable Integer sceneId) {
        List<DialogueDTO> list = dialogueService.listByScene(sceneId).stream().map(DialogueDTO::new).collect(Collectors.toList());
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DialogueDTO> update(@PathVariable UUID id, @RequestBody DialogueDTO dto) {
        Optional<Scene> scene = sceneService.getById(dto.getSceneId());
        if (scene.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Asset voice = null;
        if (dto.getVoiceAssetId() != null) {
            Optional<Asset> a = assetService.get(dto.getVoiceAssetId());
            if (a.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            voice = a.get();
        }

        Dialogue entity = dto.toEntity(scene.get(), voice);
        entity.setDialogueId(id);
        Dialogue updated = dialogueService.update(entity);
        return new ResponseEntity<>(new DialogueDTO(updated), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        dialogueService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


