package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.seeder.*;
import JIZAS.BrightMinds.entity.*;
import JIZAS.BrightMinds.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SeederService {
    @Autowired private StoryRepository storyRepository;
    @Autowired private SceneRepository sceneRepository;
    @Autowired private AssetRepository assetRepository;
    @Autowired private DialogueRepository dialogueRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private ChoiceRepository choiceRepository;
    @Autowired private AnswerRepository answerRepository;
    @Autowired private SceneAssetRepository sceneAssetRepository;

    public void seedStory(StorySeedDTO storyDTO) {
        Story story = new Story();
        story.setTitle(storyDTO.getTitle());
        story.setDescription(storyDTO.getDescription());
        story.setStoryOrder(storyDTO.getStoryOrder());
        story.setThumbnailImage(storyDTO.getThumbnailImage());
        story.setGameplayType(storyDTO.getGameplayType());
        story = storyRepository.save(story);
        if (storyDTO.getScenes() != null) {
            for (SceneSeedDTO sceneDTO : storyDTO.getScenes()) {
                seedScene(sceneDTO, story);
            }
        }
    }

    private void seedScene(SceneSeedDTO sceneDTO, Story story) {
        Scene scene = new Scene();
        scene.setStory(story);
        scene.setSceneOrder(sceneDTO.getSceneOrder());
        scene.setSceneText(sceneDTO.getSceneText());
        scene = sceneRepository.save(scene);
        if (sceneDTO.getAssets() != null) {
            for (AssetSeedDTO assetDTO : sceneDTO.getAssets()) { seedAsset(assetDTO, scene); }
        }
        if (sceneDTO.getDialogues() != null) {
            for (DialogueSeedDTO dialogueDTO : sceneDTO.getDialogues()) { seedDialogue(dialogueDTO, scene); }
        }
        if (sceneDTO.getQuestion() != null) { seedQuestion(sceneDTO.getQuestion(), scene); }
    }

    private void seedAsset(AssetSeedDTO assetDTO, Scene scene) {
        Asset asset = new Asset();
        asset.setName(assetDTO.getName());
        asset.setType(assetDTO.getType());
        asset.setFilePath(assetDTO.getFilePath());
        asset = assetRepository.save(asset);
        SceneAsset sceneAsset = new SceneAsset();
        sceneAsset.setScene(scene);
        sceneAsset.setAsset(asset);
        sceneAsset.setPositionX(assetDTO.getPositionX());
        sceneAsset.setPositionY(assetDTO.getPositionY());
        sceneAsset.setOrderIndex(assetDTO.getOrderIndex());
        sceneAsset.setIsInteractive(assetDTO.getIsInteractive() != null ? assetDTO.getIsInteractive() : false);
        sceneAsset.setMetadata(assetDTO.getMetadata());
        sceneAssetRepository.save(sceneAsset);
    }

    private void seedDialogue(DialogueSeedDTO dialogueDTO, Scene scene) {
        Dialogue dialogue = new Dialogue();
        dialogue.setScene(scene);
        dialogue.setCharacterName(dialogueDTO.getCharacterName());
        dialogue.setLineText(dialogueDTO.getLineText());
        dialogue.setOrderIndex(dialogueDTO.getOrderIndex());
        dialogueRepository.save(dialogue);
    }

    private void seedQuestion(QuestionSeedDTO questionDTO, Scene scene) {
        Question question = new Question();
        question.setSceneId(scene.getSceneId());
        // Convert String type to QuestionType enum
        if (questionDTO.getType() != null) {
            question.setType(Question.QuestionType.valueOf(questionDTO.getType()));
        }
        question.setPromptText(questionDTO.getPromptText());
        question.setPoints(questionDTO.getPoints());
        question = questionRepository.save(question);
        if (questionDTO.getChoices() != null && !questionDTO.getChoices().isEmpty()) {
            for (ChoiceSeedDTO choiceDTO : questionDTO.getChoices()) { seedChoice(choiceDTO, question); }
        }
        if (questionDTO.getAnswers() != null && !questionDTO.getAnswers().isEmpty()) {
            for (AnswerSeedDTO answerDTO : questionDTO.getAnswers()) { seedAnswer(answerDTO, question); }
        }
    }

    private void seedChoice(ChoiceSeedDTO choiceDTO, Question question) {
        Choice choice = new Choice();
        choice.setQuestion(question);
        choice.setChoiceText(choiceDTO.getChoiceText());
        choice.setIsCorrect(choiceDTO.isCorrect());
        choiceRepository.save(choice);
    }

    private void seedAnswer(AnswerSeedDTO answerDTO, Question question) {
        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setAnswerText(answerDTO.getAnswerText());
        answer.setDragdropPosition(answerDTO.getDragdropPosition());
        answerRepository.save(answer);
    }
}
