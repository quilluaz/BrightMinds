package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.seeder.*;
import JIZAS.BrightMinds.entity.*;
import JIZAS.BrightMinds.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        // Check if story exists to update it instead of creating a duplicate
        Story story = storyRepository.findByTitle(storyDTO.getTitle())
                .orElse(new Story());

        story.setTitle(storyDTO.getTitle());
        story.setDescription(storyDTO.getDescription());
        story.setStoryOrder(storyDTO.getStoryOrder());
        story.setThumbnailImage(storyDTO.getThumbnailImage());
        story.setGameplayType(storyDTO.getGameplayType());
        story.setNarrationUrl(storyDTO.getNarrationUrl());
        
        // Handle nested backgroundMusic object
        if (storyDTO.getBackgroundMusic() != null) {
            story.setBackgroundMusicFilePath(storyDTO.getBackgroundMusic().getFilePath());
            story.setBackgroundMusicVolume(storyDTO.getBackgroundMusic().getVolume());
        }
        
        story.setSequenceGraph(storyDTO.getSequenceGraph());
        story = storyRepository.save(story);

        // If updating an existing story, clear old scenes to ensure a clean sync of the new structure
        if (storyDTO.getScenes() != null) {
            
            // Manual Cascade Delete: Delete all children of existing scenes first to avoid FK constraint errors
            List<Scene> existingScenes = sceneRepository.findByStoryOrderBySceneOrderAsc(story);
            for (Scene oldScene : existingScenes) {
                // Delete SceneAssets
                sceneAssetRepository.deleteByScene(oldScene);
                
                // Delete Dialogues
                dialogueRepository.deleteByScene(oldScene);
                
                // Delete Questions (and their Choices/Answers)
                List<Question> questions = questionRepository.findBySceneId(oldScene.getSceneId());
                for (Question q : questions) {
                    choiceRepository.deleteByQuestion(q);
                    answerRepository.deleteByQuestion(q);
                    questionRepository.delete(q);
                }
            }
            sceneRepository.flush(); // Ensure children are deleted

            // Now safely delete the scenes
            sceneRepository.deleteByStory(story);
            sceneRepository.flush(); // Ensure delete is committed before inserting new scenes

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

        if (assetDTO.getFilePath() == null || assetDTO.getFilePath().trim().isEmpty()) {
            System.out.println("Skipping asset with empty file path: " + assetDTO.getName());
            return;
        }

        Asset asset = assetRepository.findByName(assetDTO.getName())
                .orElseGet(() -> {
                    Asset newAsset = new Asset();
                    newAsset.setName(assetDTO.getName());
                    newAsset.setType(assetDTO.getType());
                    newAsset.setFilePath(assetDTO.getFilePath());
                    // The new asset is saved to the database here
                    return assetRepository.save(newAsset);
                });

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
        dialogue.setLineTextTl(dialogueDTO.getLineTextTl());
        dialogue.setOrderIndex(dialogueDTO.getOrderIndex());
        
        // Link voice asset if voiceover field is provided
        if (dialogueDTO.getVoiceover() != null && !dialogueDTO.getVoiceover().isEmpty()) {
            Asset voiceAsset = assetRepository.findByName(dialogueDTO.getVoiceover())
                .orElse(null);
            if (voiceAsset != null) {
                dialogue.setVoiceAsset(voiceAsset);
            } else {
                System.out.println("Warning: Voiceover asset not found: " + dialogueDTO.getVoiceover() + 
                                 " for dialogue: " + dialogueDTO.getCharacterName());
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
        System.out.println("Seeding badges...");

        // Story Specific - Amulet
        createBadge("Amulet Ace", "Score a perfect 100% on The Secret of the Amulet! You're Liam's superstar, saving the village!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073161/AmuletAce_plgoi7.png", 100);
        createBadge("Plains Pathfinder", "Finish The Secret of the Amulet in under 10 minutes! You're zooming through plains like a speedy hero!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073167/PlainsPathfinder_ohfd1g.png", 0);
        createBadge("Village Victory", "Improve your score by any amount on any attempt of The Secret of the Amulet! You're Liam's comeback king!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073201/VillageVictory_rnvunh.png", 0);
        createBadge("Early Amulet Explorer", "Finish The Secret of the Amulet in its first week! You're the fastest village saver!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073183/EarlyAmuletExplorer_pkofdx.png", 1);

        // Story Specific - Scrapbook
        createBadge("Scrapbook Sorcerer", "Score 90% or higher on Leah's Scrapbook! You're a magical organizer of minerals!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073170/ScrapbookSorcerer_o2sdcq.png", 90);
        createBadge("Speedy Sorter", "Finish Leah's Scrapbook before Mom arrives in under 5 minutes! You're a turbo tidier!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073163/SpeedySorter_xa7dek.png", 0);
        createBadge("Mineral Maestro", "Get every mineral question right in Leah's Scrapbook! You're a rock star at arranging!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073182/MineralMaestro_dxuygm.png", 100);

        // Story Specific - Heroes
        createBadge("Hero Historian", "Score 95% or higher on Hiraya's Heroes! You're a genius at solving hero sequences!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073185/HeroHistorian_q8zfvj.png", 95);
        createBadge("Auntie's Ally", "Complete Hiraya's Heroes 3 times! You're Aunt Marietta's favorite sidekick!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073188/AuntiesAlly_c0fqpa.png", 3);
        createBadge("Sequence Superstar", "Perfectly solve the hero sequence in Hiraya's Heroes! You're a timeline wizard!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761073198/SequenceSuperstar_kvvkrz.png", 100);

        // Generalized
        createBadge("Super Story Smasher", "Blast to a perfect 100% on any story! You're a scoring superhero, tung tung tung sahur!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075417/SuperStorySmasher_cqepyx.png", 100);
        createBadge("Quest Crusader", "Complete all 3 stories! You're a brave adventurer conquering every tale!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075406/QuestCrusader_mxcgld.png", 3);
        createBadge("Speedy Story Sprinter", "Finish any story in under 7 minutes with 80% or more! You're zooming like a silly cheetah!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075411/SpeedyStorySprinter_prtpqu.png", 7);
        createBadge("Story Streak Star", "Score 85% or higher on 2 stories in a row! You're a ninja with a sparkly streak!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075398/StoryStreakStar_stk34b.png", 85);
        createBadge("Bouncy Brainiac", "Score 90% or higher on any story! Your brain is bouncing with smarts!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075416/BouncyBraniac_bvptuj.png", 90);
        createBadge("Retry Rocketeer", "Boost your score by 15% on any story retry! You're blasting off to better scores!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075425/Retry_Rocketeer_dvbiqv.png", 15);
        createBadge("Goofy Zero Guru", "Score 0% on any story! You're a wacky guru of oopsies, tung tung tung sahur!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075422/Goofy_Zero_Guru_lxfrjr.png", 0);
        createBadge("Turtle Tickler", "Take over 20 minutes to finish any story! You're a giggling turtle taking your time!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075403/TurtleTickler_bvitn6.png", 20);
        createBadge("Wobbly Wanderer", "Get a lower score on a retry of any story! You're wandering backward with a goofy grin!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075439/WobblyWanderer_wglumt.png", 0);
        createBadge("Jungle Jumper", "Complete 5 stories total! You're hopping through the story jungle like a happy frog!", "https://res.cloudinary.com/dymjwplal/image/upload/v1761075400/JungleJumper_ngdhmw.png", 5);

        System.out.println("Badge seeding completed.");
    }

    private void createBadge(String name, String description, String imageUrl, int condition) {
        if (badgeRepository.findByName(name).isPresent()) {
            System.out.println("Badge '" + name + "' already exists. Skipping.");
            return;
        }
        
        Badge badge = new Badge();
        badge.setName(name);
        badge.setDescription(description);
        badge.setImageUrl(imageUrl);
        badge.setCondition(condition);
        badgeRepository.save(badge);
        System.out.println("Created badge: " + name);
    }
}
