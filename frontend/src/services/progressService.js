import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getStudentProgress = async (studentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/progress?studentId=${studentId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch progress"
      );
    }
    throw new Error("Network error occurred");
  }
};
