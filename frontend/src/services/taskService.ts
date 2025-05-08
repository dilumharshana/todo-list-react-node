import { API_BASE_URL } from "../configs";
import type { Task, NewTaskData } from "../types";

// Base API endpoint for task-related operations
const API_URL = API_BASE_URL;

/**
 * Fetches all recent tasks from the backend API.
 *
 * @returns Promise<Task[]> - A list of Task objects.
 * @throws Error if the network request fails or response is not OK.
 *
 * Design Notes:
 * - Follows the Repository Pattern: encapsulates fetching logic separate from components.
 * - Promotes separation of concerns by isolating API logic.
 */
export const fetchRecentTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks`);

    // Ensure the request was successful
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse and return the JSON data as a list of tasks
    return await response.json();
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Creates a new task by sending task data to the backend API.
 *
 * @param taskData - Data required to create a new task.
 * @returns Promise<Task> - The created Task object.
 * @throws Error if the network request fails or response is not OK.
 *
 * Design Notes:
 * - Uses Command Pattern: sends a command (create) to the server.
 * - Data is serialized to JSON before being sent.
 */
export const createTask = async (taskData: NewTaskData): Promise<Task> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Marks a task as complete by calling the corresponding API endpoint.
 *
 * @param taskId - The unique ID of the task to be marked complete.
 * @returns Promise<Task> - The updated Task object after completion.
 * @throws Error if the network request fails or response is not OK.
 *
 * Design Notes:
 * - Follows Command Pattern: issues a "complete" command.
 * - URL is dynamically composed using template literals.
 */
export const completeTask = async (taskId: string): Promise<Task> => {
  try {
    const response = await fetch(`${API_URL}/${taskId}/complete`, {
      method: "PUT"
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
};
