import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Get all quizzes
export const getAllQuizzes = async () => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/list`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch quizzes");
    }
    throw new Error("Network error occurred");
  }
};

// Create a new quiz
export const createQuiz = async (quizData, teacherId) => {
  try {
    const response = await axios.post(
      `${API_URL}/quizzes/create?teacherId=${teacherId}`,
      quizData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to create quiz");
    }
    throw new Error("Network error occurred");
  }
};

// Submit a quiz
export const submitQuiz = async (submissionData, studentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/quizzes/submit?studentId=${studentId}`,
      submissionData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to submit quiz");
    }
    throw new Error("Network error occurred");
  }
};
