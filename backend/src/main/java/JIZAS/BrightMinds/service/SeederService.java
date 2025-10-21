package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.seeder.*;
import JIZAS.BrightMinds.entity.*;
import JIZAS.BrightMinds.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Service
public class SeederService {

    private final StoryRepository storyRepository;
    private final SceneRepository sceneRepository;
    private final AssetRepository assetRepository;
    private final SceneAssetRepository sceneAssetRepository;
    private final DialogueRepository dialogueRepository;
    private final QuestionRepository questionRepository;
    private final ChoiceRepository choiceRepository;
    private final AnswerRepository answerRepository;
    private final BadgeRepository badgeRepository;

    @Autowired
    public SeederService(StoryRepository storyRepository, SceneRepository sceneRepository,
                         AssetRepository assetRepository, SceneAssetRepository sceneAssetRepository,
                         DialogueRepository dialogueRepository, QuestionRepository questionRepository,
                         ChoiceRepository choiceRepository, AnswerRepository answerRepository,
                         BadgeRepository badgeRepository) {
        this.storyRepository = storyRepository;
        this.sceneRepository = sceneRepository;
        this.assetRepository = assetRepository;
        this.sceneAssetRepository = sceneAssetRepository;
        this.dialogueRepository = dialogueRepository;
        this.questionRepository = questionRepository;
        this.choiceRepository = choiceRepository;
        this.answerRepository = answerRepository;
        this.badgeRepository = badgeRepository;
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
                    // Create or find asset by name and type
                    Asset asset = assetRepository.findByNameAndType(assetDTO.getName(), assetDTO.getType())
                            .orElseGet(() -> {
                                Asset newAsset = new Asset();
                                newAsset.setName(assetDTO.getName());
                                newAsset.setType(assetDTO.getType());
                                newAsset.setFilePath(assetDTO.getFilePath());
                                return assetRepository.save(newAsset);
                            });

                    SceneAsset sceneAsset = new SceneAsset();
                    sceneAsset.setScene(savedScene);
                    sceneAsset.setAsset(asset);
                    sceneAsset.setPositionX(assetDTO.getPositionX());
                    sceneAsset.setPositionY(assetDTO.getPositionY());
                    sceneAsset.setOrderIndex(assetDTO.getOrderIndex());
                    sceneAsset.setIsInteractive(assetDTO.getIsInteractive());
                    
                    // Handle metadata - merge disappearAfter if present
                    Map<String, Object> metadata = assetDTO.getMetadata();
                    if (assetDTO.getDisappearAfter() != null) {
                        if (metadata == null) {
                            metadata = new java.util.HashMap<>();
                        }
                        metadata.put("disappearAfter", assetDTO.getDisappearAfter());
                    }
                    sceneAsset.setMetadata(metadata);
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
                    // Note: voiceover field is not stored in Dialogue entity, it's handled by frontend
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

                // Handle choices for MCQ questions
                if (questionDTO.getChoices() != null) {
                    for (ChoiceSeedDTO choiceDTO : questionDTO.getChoices()) {
                        Choice choice = new Choice();
                        choice.setQuestion(savedQuestion);
                        choice.setChoiceText(choiceDTO.getChoiceText());
                        choice.setIsCorrect(choiceDTO.isCorrect());
                        choiceRepository.save(choice);
                    }
                }

                // Handle answers for DragDrop questions
                if (questionDTO.getAnswers() != null) {
                    for (AnswerSeedDTO answerDTO : questionDTO.getAnswers()) {
                        Answer answer = new Answer();
                        answer.setQuestion(savedQuestion);
                        answer.setAnswerText(answerDTO.getAnswerText());
                        answer.setDragdropPosition(answerDTO.getDragdropPosition());
                        answerRepository.save(answer);
                    }
                }
            }
        }
    }

    @Transactional
    public void seedBadges() {
        System.out.println("SeederService: Starting badge seeding...");
        
        // Check if badges already exist
        if (badgeRepository.count() > 0) {
            System.out.println("SeederService: Badges already exist, skipping seeding");
            return;
        }

        // Score-based badges
        createBadge("Perfect Score", "Achieve a perfect 100% score on any story", 
                   "/images/badges/perfect-score.png", 100);
        createBadge("Excellent Performance", "Achieve 90% or higher on any story", 
                   "/images/badges/excellent-performance.png", 90);
        createBadge("Good Performance", "Achieve 75% or higher on any story", 
                   "/images/badges/good-performance.png", 75);
        createBadge("Passing Grade", "Achieve 60% or higher on any story", 
                   "/images/badges/passing-grade.png", 60);

        // Completion-based badges
        createBadge("First Steps", "Complete your first story", 
                   "/images/badges/first-steps.png", 1);
        createBadge("Story Explorer", "Complete 5 different stories", 
                   "/images/badges/story-explorer.png", 5);
        createBadge("Story Master", "Complete the same story 3 times", 
                   "/images/badges/story-master.png", 3);
        createBadge("Completionist", "Complete 10 different stories", 
                   "/images/badges/completionist.png", 10);

        // Performance-based badges
        createBadge("Consistent Performer", "Achieve 80% or higher on 3 consecutive stories", 
                   "/images/badges/consistent-performer.png", 80);
        createBadge("Speed Demon", "Complete a story in under 5 minutes with 85%+ score", 
                   "/images/badges/speed-demon.png", 85);
        createBadge("Perfectionist", "Achieve 100% on 3 different stories", 
                   "/images/badges/perfectionist.png", 100);
        createBadge("Rising Star", "Improve your score by 20% or more on a retry", 
                   "/images/badges/rising-star.png", 20);

        // Special achievement badges
        createBadge("Early Bird", "Complete a story within the first week of release", 
                   "/images/badges/early-bird.png", 1);
        createBadge("Dedicated Learner", "Complete 20 stories total", 
                   "/images/badges/dedicated-learner.png", 20);
        createBadge("Bright Mind", "Achieve 95% or higher on 5 different stories", 
                   "/images/badges/bright-mind.png", 95);
        createBadge("Legend", "Complete all available stories with 90%+ average", 
                   "/images/badges/legend.png", 90);

        System.out.println("SeederService: Badge seeding completed successfully");
    }

    private void createBadge(String name, String description, String imageUrl, int condition) {
        Badge badge = new Badge();
        badge.setName(name);
        badge.setDescription(description);
        badge.setImageUrl(imageUrl);
        badge.setCondition(condition);
        badgeRepository.save(badge);
        System.out.println("SeederService: Created badge: " + name);
    }
}