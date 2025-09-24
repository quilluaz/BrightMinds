package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.entity.Dialogue;
import JIZAS.BrightMinds.repository.DialogueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class DialogueService {

    @Autowired
    private DialogueRepository dialogueRepository;

    public Dialogue create(Dialogue d) { return dialogueRepository.save(d); }
    public List<Dialogue> listAll() { return dialogueRepository.findAll(); }
    public Optional<Dialogue> getById(UUID id) { return dialogueRepository.findById(id); }
    public List<Dialogue> listByScene(Integer sceneId) { return dialogueRepository.findByScene_SceneIdOrderByOrderIndexAsc(sceneId); }
    public Dialogue update(Dialogue d) {
        if (!dialogueRepository.existsById(d.getDialogueId())) {
            throw new RuntimeException("Dialogue not found with ID: " + d.getDialogueId());
        }
        return dialogueRepository.save(d);
    }
    public void delete(UUID id) { dialogueRepository.deleteById(id); }
}


