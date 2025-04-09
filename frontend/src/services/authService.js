import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("Network error occurred");
  }
};

export const registerUser = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    }
    throw new Error("Network error occurred");
  }
};
