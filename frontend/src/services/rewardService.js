import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Get rewards for a student
export const getStudentRewards = async (studentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/rewards?studentId=${studentId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch rewards");
    }
    throw new Error("Network error occurred");
  }
};

// Get total gems for a student
export const getStudentTotalGems = async (studentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/rewards/total?studentId=${studentId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch total gems"
      );
    }
    throw new Error("Network error occurred");
  }
};
