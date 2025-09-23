package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.SceneAsset;
import JIZAS.BrightMinds.repository.SceneAssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SceneAssetService {

	private final SceneAssetRepository repo;

	public SceneAssetService(SceneAssetRepository repo) {
		this.repo = repo;
	}

	public SceneAsset create(SceneAsset s) { return repo.save(s); }
	public Optional<SceneAsset> get(Long id) { return repo.findById(id); }
	public List<SceneAsset> listAll() { return repo.findAll(); }
	public List<SceneAsset> listByScene(Integer sceneId) { return repo.findByScene_SceneId(sceneId); }
	public SceneAsset update(SceneAsset s) { return repo.save(s); }
	public void delete(Long id) { repo.deleteById(id); }
}


