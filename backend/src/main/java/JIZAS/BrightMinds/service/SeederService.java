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
    @Autowired private BadgeRepository badgeRepository;

    public void seedStory(StorySeedDTO storyDTO) {
        Story story = new Story();
        story.setTitle(storyDTO.getTitle());
        story.setDescription(storyDTO.getDescription());
        story.setStoryOrder(storyDTO.getStoryOrder());
        story.setThumbnailImage(storyDTO.getThumbnailImage());
        story.setGameplayType(storyDTO.getGameplayType());
        story.setNarrationUrl(storyDTO.getNarrationUrl());
        story.setSequenceGraph(storyDTO.getSequenceGraph());
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
        
        // Seed assets FIRST so they exist when dialogues need to reference them
        if (sceneDTO.getAssets() != null) {
            for (AssetSeedDTO assetDTO : sceneDTO.getAssets()) {
                seedAsset(assetDTO, scene);
            }
        }
        
        // Then seed dialogues (which may reference assets)
        if (sceneDTO.getDialogues() != null) {
            for (DialogueSeedDTO dialogueDTO : sceneDTO.getDialogues()) {
                seedDialogue(dialogueDTO, scene);
            }
        }
        
        // Finally seed questions
        if (sceneDTO.getQuestion() != null) {
            seedQuestion(sceneDTO.getQuestion(), scene);
        }
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
        
        // Link voice asset if voiceover field is provided
        if (dialogueDTO.getVoiceover() != null && !dialogueDTO.getVoiceover().isEmpty()) {
            Asset voiceAsset = assetRepository.findByName(dialogueDTO.getVoiceover())
                .orElse(null);
            if (voiceAsset != null) {
                dialogue.setVoiceAsset(voiceAsset);
            }
        }
        
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
        choice.setChoiceImageUrl(choiceDTO.getChoiceImageUrl());
        choice.setOrderIndex(choiceDTO.getOrderIndex());
        choiceRepository.save(choice);
    }

    private void seedAnswer(AnswerSeedDTO answerDTO, Question question) {
        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setAnswerText(answerDTO.getAnswerText());
        answer.setAssetName(answerDTO.getAssetName());
        answer.setIsCorrect(answerDTO.isCorrect());
        answer.setDragdropPosition(answerDTO.getDragdropPosition());
        answerRepository.save(answer);
    }

    public void seedBadges() {
        // Check if badges already exist to avoid duplicates
        if (badgeRepository.count() > 0) {
            System.out.println("Badges already exist. Skipping seed.");
            return;
        }

        // Create default badges with different score thresholds
        createBadge("Bronze Star", "Complete your first game", "/badges/bronze-star.png", 1);
        createBadge("Silver Star", "Earn 50 points", "/badges/silver-star.png", 50);
        createBadge("Gold Star", "Earn 100 points", "/badges/gold-star.png", 100);
        createBadge("Platinum Star", "Earn 200 points", "/badges/platinum-star.png", 200);
        createBadge("Diamond Star", "Earn 300 points", "/badges/diamond-star.png", 300);
        createBadge("Master Player", "Earn 500 points", "/badges/master-player.png", 500);
        
        System.out.println("Successfully seeded badges.");
    }

    private void createBadge(String name, String description, String imageUrl, int condition) {
        Badge badge = new Badge();
        badge.setName(name);
        badge.setDescription(description);
        badge.setImageUrl(imageUrl);
        badge.setCondition(condition);
        badgeRepository.save(badge);
    }
}
