import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api"; // Replace with your backend URL

// Create an Axios instance with a token attached
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token to Authorization header
  },
});

export const subscribeNotifications = async (subscription) => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/notification/subscribe`,
      {
        subscription,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
  }
};

export const getAiAdvice = async ({
  id,
  title,
  description,
  priority,
  progress,
  deadline,
  completed,
}) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/ai/get-advice`, {
      id,
      title,
      description,
      priority,
      progress,
      deadline,
      completed,
    });
    return response.data;
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
  }
};

export const getPrioritizedTasks = async ({ tasks }) => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/ai/prioritize-task`,
      {
        tasks,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
  }
};

export const verifySignature = async ({ userAddress, message, signature }) => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/auth/verify-signature`,
      {
        address: userAddress,
        message,
        signature,
      }
    );
    const result = await response.data;
    if (result.success) {
      console.log("Authentication successful!");
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } else {
      console.log("Authentication failed.");
    }
  } catch (error) {
    console.error("Error in authentication:", error);
    throw error.response ? error.response.data : error;
  }
};

export const createTask = async ({
  title,
  description,
  priority,
  progress,
  deadline, // Add deadline
}) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/tasks/create`, {
      title,
      description,
      priority,
      progress,
      deadline, // Include deadline
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error.response ? error.response.data : error;
  }
};

export const getAllTasks = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/tasks`);
    return (
      response.data.map((task) => ({
        id: Number(task.id),
        title: task.title,
        description: task.description,
        priority: task.priority, // Include priority
        progress: task.progress, // Include progress
        completed: task.completed,
        owner: task.owner,
        aiAdvice: task.aiAdvice,
        deadline: task.deadline, // Include deadline
      })) || []
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export const getTask = async (id) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/tasks/${id}`);
    let task = response.data;
    return {
      id: Number(task.id),
      title: task.title,
      description: task.description,
      priority: task.priority, // Include priority
      progress: task.progress, // Include progress
      completed: task.completed,
      owner: task.owner,
      deadline: task.deadline, // Include deadline
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export const markTaskCompleted = async (id) => {
  try {
    const response = await apiClient.patch(
      `${API_BASE_URL}/tasks/${id}/complete`,
      {
        completed: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking task as completed:", error);
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const editTask = async ({
  taskId,
  title,
  description,
  priority,
  progress,
  deadline, // Add deadline
}) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/tasks/${taskId}`, {
      title,
      description,
      priority,
      progress,
      deadline, // Include deadline
    });
    return response.data;
  } catch (error) {
    console.error("Error editing task:", error);
  }
};
