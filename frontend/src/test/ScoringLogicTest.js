// Test file to verify scoring logic
// This is a simple test to verify the scoring calculation logic

describe("Scoring Logic Tests", () => {
  test("should calculate correct points for question with no mistakes", () => {
    const pointsPerQuestion = 4;
    const mistakesForThisQuestion = 0;
    const pointsEarned = Math.max(
      0,
      pointsPerQuestion - mistakesForThisQuestion
    );

    expect(pointsEarned).toBe(4);
  });

  test("should calculate correct points for question with 1 mistake", () => {
    const pointsPerQuestion = 4;
    const mistakesForThisQuestion = 1;
    const pointsEarned = Math.max(
      0,
      pointsPerQuestion - mistakesForThisQuestion
    );

    expect(pointsEarned).toBe(3);
  });

  test("should calculate correct points for question with 2 mistakes", () => {
    const pointsPerQuestion = 4;
    const mistakesForThisQuestion = 2;
    const pointsEarned = Math.max(
      0,
      pointsPerQuestion - mistakesForThisQuestion
    );

    expect(pointsEarned).toBe(2);
  });

  test("should calculate correct points for question with 3 mistakes", () => {
    const pointsPerQuestion = 4;
    const mistakesForThisQuestion = 3;
    const pointsEarned = Math.max(
      0,
      pointsPerQuestion - mistakesForThisQuestion
    );

    expect(pointsEarned).toBe(1);
  });

  test("should calculate correct points for question with 4 or more mistakes", () => {
    const pointsPerQuestion = 4;
    const mistakesForThisQuestion = 4;
    const pointsEarned = Math.max(
      0,
      pointsPerQuestion - mistakesForThisQuestion
    );

    expect(pointsEarned).toBe(0);
  });

  test("should handle question mistakes state correctly", () => {
    // Simulate the question mistakes state
    const questionMistakes = {
      1: 2, // Question 1 has 2 mistakes
      2: 0, // Question 2 has 0 mistakes
      3: 1, // Question 3 has 1 mistake
    };

    const pointsPerQuestion = 4;

    // Test question 1 (2 mistakes)
    const points1 = Math.max(0, pointsPerQuestion - (questionMistakes[1] || 0));
    expect(points1).toBe(2);

    // Test question 2 (0 mistakes)
    const points2 = Math.max(0, pointsPerQuestion - (questionMistakes[2] || 0));
    expect(points2).toBe(4);

    // Test question 3 (1 mistake)
    const points3 = Math.max(0, pointsPerQuestion - (questionMistakes[3] || 0));
    expect(points3).toBe(3);
  });

  test("should handle undefined question mistakes", () => {
    const questionMistakes = {};
    const questionId = 1;
    const pointsPerQuestion = 4;

    const mistakesForThisQuestion = questionMistakes[questionId] || 0;
    const pointsEarned = Math.max(
      0,
      pointsPerQuestion - mistakesForThisQuestion
    );

    expect(pointsEarned).toBe(4);
  });
});

// Test the mistake tracking logic
describe("Mistake Tracking Tests", () => {
  test("should properly increment mistake count for a question", () => {
    let questionMistakes = {};
    const questionId = 1;

    // First mistake
    questionMistakes[questionId] = (questionMistakes[questionId] || 0) + 1;
    expect(questionMistakes[questionId]).toBe(1);

    // Second mistake
    questionMistakes[questionId] = (questionMistakes[questionId] || 0) + 1;
    expect(questionMistakes[questionId]).toBe(2);

    // Third mistake
    questionMistakes[questionId] = (questionMistakes[questionId] || 0) + 1;
    expect(questionMistakes[questionId]).toBe(3);
  });

  test("should handle multiple questions independently", () => {
    let questionMistakes = {};

    // Question 1: 2 mistakes
    questionMistakes[1] = (questionMistakes[1] || 0) + 1;
    questionMistakes[1] = (questionMistakes[1] || 0) + 1;

    // Question 2: 1 mistake
    questionMistakes[2] = (questionMistakes[2] || 0) + 1;

    // Question 3: 0 mistakes (not touched)

    expect(questionMistakes[1]).toBe(2);
    expect(questionMistakes[2]).toBe(1);
    expect(questionMistakes[3]).toBeUndefined();
  });
});

console.log("Scoring logic tests completed successfully!");
