package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.entity.Asset;
import JIZAS.BrightMinds.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

	private final AssetService service;

	public AssetController(AssetService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<Asset> create(@RequestBody Asset a) {
		return new ResponseEntity<>(service.create(a), HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<Asset>> list() {
		return new ResponseEntity<>(service.listAll(), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Asset> get(@PathVariable Long id) {
		Optional<Asset> a = service.get(id);
		return a.map(asset -> new ResponseEntity<>(asset, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Asset> update(@PathVariable Long id, @RequestBody Asset a) {
		a.setAssetId(id);
		return new ResponseEntity<>(service.update(a), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}


