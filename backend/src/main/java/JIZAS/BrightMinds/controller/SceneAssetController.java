package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.entity.SceneAsset;
import JIZAS.BrightMinds.service.SceneAssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/scene-assets")
@CrossOrigin(origins = "*")
public class SceneAssetController {

	private final SceneAssetService service;

	public SceneAssetController(SceneAssetService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<SceneAsset> create(@RequestBody SceneAsset s) {
		return new ResponseEntity<>(service.create(s), HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<SceneAsset>> list() {
		return new ResponseEntity<>(service.listAll(), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<SceneAsset> get(@PathVariable Long id) {
		Optional<SceneAsset> s = service.get(id);
		return s.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@GetMapping("/scene/{sceneId}")
	public ResponseEntity<List<SceneAsset>> byScene(@PathVariable Integer sceneId) {
		return new ResponseEntity<>(service.listByScene(sceneId), HttpStatus.OK);
	}

	@PutMapping("/{id}")
	public ResponseEntity<SceneAsset> update(@PathVariable Long id, @RequestBody SceneAsset s) {
		s.setSceneAssetId(id);
		return new ResponseEntity<>(service.update(s), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}


