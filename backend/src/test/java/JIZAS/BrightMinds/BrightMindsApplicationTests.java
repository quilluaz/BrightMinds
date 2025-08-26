package JIZAS.BrightMinds;

import JIZAS.BrightMinds.entity.Question;
import JIZAS.BrightMinds.entity.Choice;
import JIZAS.BrightMinds.entity.Answer;
import JIZAS.BrightMinds.repository.QuestionRepository;
import JIZAS.BrightMinds.repository.ChoiceRepository;
import JIZAS.BrightMinds.repository.AnswerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class BrightMindsApplicationTests {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Test
    void contextLoads() {
        // Test that the application context loads successfully
    }

    @Test
    void testQuestionCreation() {
        // Test creating a question
        Question question = new Question();
        question.setSceneId(1);
        question.setType(Question.QuestionType.MCQ);
        question.setPromptText("Test question");
        question.setPoints(10);

        Question savedQuestion = questionRepository.save(question);
        assertNotNull(savedQuestion.getQuestionId());
        assertEquals("Test question", savedQuestion.getPromptText());
    }

    @Test
    void testChoiceCreation() {
        // Test creating a choice
        Choice choice = new Choice();
        choice.setChoiceText("Test choice");
        choice.setIsCorrect(true);

        Choice savedChoice = choiceRepository.save(choice);
        assertNotNull(savedChoice.getChoiceId());
        assertEquals("Test choice", savedChoice.getChoiceText());
        assertTrue(savedChoice.getIsCorrect());
    }

    @Test
    void testAnswerCreation() {
        // Test creating an answer
        Answer answer = new Answer();
        answer.setAnswerText("Test answer");
        answer.setDragdropPosition(1);

        Answer savedAnswer = answerRepository.save(answer);
        assertNotNull(savedAnswer.getAnswerId());
        assertEquals("Test answer", savedAnswer.getAnswerText());
        assertEquals(1, savedAnswer.getDragdropPosition());
    }

    @Test
    void testQuestionTypeEnum() {
        // Test QuestionType enum values
        assertEquals("MCQ", Question.QuestionType.MCQ.name());
        assertEquals("DragDog", Question.QuestionType.DragDog.name());
        assertEquals("ID", Question.QuestionType.ID.name());
    }
}
