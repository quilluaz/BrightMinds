package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.*;
import JIZAS.BrightMinds.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GameService {

    @Autowired
    private SceneService sceneService;

    @Autowired
    private DialogueService dialogueService;

    @Autowired
    private SceneAssetService sceneAssetService;

    @Autowired
    private QuestionService questionService;

    public GameSceneDTO getGameScene(Integer sceneId) {
        Scene scene = sceneService.getById(sceneId)
                .orElseThrow(() -> new RuntimeException("Scene not found with ID: " + sceneId));

        List<Dialogue> dialogues = dialogueService.listByScene(sceneId);
        List<SceneAsset> sceneAssets = sceneAssetService.listByScene(sceneId);
        List<Question> questions = questionService.getQuestionsBySceneIdWithChoicesAndAnswers(sceneId);

        GameSceneDTO gameSceneDTO = new GameSceneDTO();
        gameSceneDTO.setScene(new SceneDTO(scene));
        gameSceneDTO.setDialogues(dialogues.stream().map(DialogueDTO::new).collect(Collectors.toList()));
        gameSceneDTO.setAssets(sceneAssets.stream().map(SceneAssetDTO::new).collect(Collectors.toList()));

        if (!questions.isEmpty()) {
            // Assuming one question per scene for now
            gameSceneDTO.setQuestion(new QuestionDTO(questions.get(0)));
        }

        return gameSceneDTO;
    }
}