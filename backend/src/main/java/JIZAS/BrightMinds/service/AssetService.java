package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Asset;
import JIZAS.BrightMinds.repository.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AssetService {

	private final AssetRepository repo;

	public AssetService(AssetRepository repo) {
		this.repo = repo;
	}

	public Asset create(Asset a) { return repo.save(a); }
	public List<Asset> listAll() { return repo.findAll(); }
	public Optional<Asset> get(Long id) { return repo.findById(id); }
	public Asset update(Asset a) { return repo.save(a); }
	public void delete(Long id) { repo.deleteById(id); }
}


