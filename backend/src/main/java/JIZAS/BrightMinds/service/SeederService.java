package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.seeder.*;
import JIZAS.BrightMinds.entity.*;
import JIZAS.BrightMinds.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SeederService {

    private final StoryRepository storyRepository;
    private final SceneRepository sceneRepository;
    private final AssetRepository assetRepository;
    private final SceneAssetRepository sceneAssetRepository;
    private final DialogueRepository dialogueRepository;
    private final QuestionRepository questionRepository;
    private final ChoiceRepository choiceRepository;

    public SeederService(StoryRepository storyRepository, SceneRepository sceneRepository,
                         AssetRepository assetRepository, SceneAssetRepository sceneAssetRepository,
                         DialogueRepository dialogueRepository, QuestionRepository questionRepository,
                         ChoiceRepository choiceRepository) {
        this.storyRepository = storyRepository;
        this.sceneRepository = sceneRepository;
        this.assetRepository = assetRepository;
        this.sceneAssetRepository = sceneAssetRepository;
        this.dialogueRepository = dialogueRepository;
        this.questionRepository = questionRepository;
        this.choiceRepository = choiceRepository;
    }

    @Transactional
    public void seedStory(StorySeedDTO storyDTO) {

        Story story = new Story();
        story.setTitle(storyDTO.getTitle());
        story.setDescription(storyDTO.getDescription());
        story.setStoryOrder(storyDTO.getStoryOrder());
        story.setThumbnailImage(storyDTO.getThumbnailImage());
        Story savedStory = storyRepository.save(story);

        for (SceneSeedDTO sceneDTO : storyDTO.getScenes()) {
            Scene scene = new Scene();
            scene.setStory(savedStory);
            scene.setSceneOrder(sceneDTO.getSceneOrder());
            scene.setSceneText(sceneDTO.getSceneText());
            Scene savedScene = sceneRepository.save(scene);

            if (sceneDTO.getAssets() != null) {
                for (AssetSeedDTO assetDTO : sceneDTO.getAssets()) {
                    // Check if asset exists to reuse it, otherwise create it
                    Asset asset = assetRepository.findByName(assetDTO.getName())
                            .orElseGet(() -> {
                                Asset newAsset = new Asset();
                                newAsset.setName(assetDTO.getName());
                                newAsset.setType(assetDTO.getType());
                                newAsset.setFilePath(assetDTO.getFilePath());
                                newAsset.setMetadata(assetDTO.getMetadata());
                                return assetRepository.save(newAsset);
                            });

                    SceneAsset sceneAsset = new SceneAsset();
                    sceneAsset.setScene(savedScene);
                    sceneAsset.setAsset(asset);
                    // Populate SceneAsset with positioning and ordering data
                    sceneAsset.setPositionX(assetDTO.getPositionX());
                    sceneAsset.setPositionY(assetDTO.getPositionY());
                    sceneAsset.setOrderIndex(assetDTO.getOrderIndex());
                    sceneAsset.setIsInteractive(assetDTO.getIsInteractive());
                    sceneAssetRepository.save(sceneAsset);
                }
            }

            if (sceneDTO.getDialogues() != null) {
                for (DialogueSeedDTO dialogueDTO : sceneDTO.getDialogues()) {
                    Dialogue dialogue = new Dialogue();
                    dialogue.setScene(savedScene);
                    dialogue.setCharacterName(dialogueDTO.getCharacterName());
                    dialogue.setLineText(dialogueDTO.getLineText());
                    dialogue.setOrderIndex(dialogueDTO.getOrderIndex());
                    dialogueRepository.save(dialogue);
                }
            }

            if (sceneDTO.getQuestion() != null) {
                QuestionSeedDTO questionDTO = sceneDTO.getQuestion();
                Question question = new Question();
                question.setSceneId(savedScene.getSceneId());
                question.setType(Question.QuestionType.valueOf(questionDTO.getType()));
                question.setPromptText(questionDTO.getPromptText());
                question.setPoints(questionDTO.getPoints());
                Question savedQuestion = questionRepository.save(question);

                if (questionDTO.getChoices() != null) {
                    for (ChoiceSeedDTO choiceDTO : questionDTO.getChoices()) {
                        Choice choice = new Choice();
                        choice.setQuestion(savedQuestion);
                        choice.setChoiceText(choiceDTO.getChoiceText());
                        choice.setIsCorrect(choiceDTO.isCorrect());
                        choiceRepository.save(choice);
                    }
                }
            }
        }
    }
}