import {
  fetchRecentTasks,
  createTask,
  completeTask
} from "../services/taskService";
import { API_BASE_URL } from "../configs";

// Mocking the global fetch
// TypeScript-friendly mock for global.fetch
global.fetch = jest.fn() as jest.Mock; x
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("Task Service API", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mock calls after each test
  });

  it("fetchRecentTasks should return task list on successful fetch", async () => {
    const mockResponse = [
      {
        id: "1",
        title: "Test Task 1",
        description: "Description 1",
        status: "pending"
      },
      {
        id: "2",
        title: "Test Task 2",
        description: "Description 2",
        status: "pending"
      }
    ];

    // Mock the fetch response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const tasks = await fetchRecentTasks();

    expect(tasks).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/tasks`);
  });

  it("fetchRecentTasks should throw an error on failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,             // Marks the request as failed
      status: 404,           // HTTP Status code (e.g., Not Found)
      statusText: "Not Found", // Status text for error details
      json: async () => {    // Simulate an empty response or error response body
        return { error: "Resource not found" };
      }
    } as Response);

    await expect(fetchRecentTasks()).rejects.toThrow(
      "Network response was not ok"
    );
  });

  // it("createTask should create and return a new task", async () => {
  //   const newTaskData = { title: "New Task", description: "New Description" };
  //   const mockCreatedTask = { id: "3", ...newTaskData, status: "pending" };

  //   fetch.mockResolvedValueOnce({
  //     ok: true,              // Marks the request as successful
  //     status: 200,           // HTTP Status code (e.g., OK)
  //     json: async () => mockCreatedTask // Mock the response body to return your task object
  //   } as Response);

  //   const createdTask = await createTask(newTaskData);

  //   expect(createdTask).toEqual(mockCreatedTask);
  //   expect(fetch).toHaveBeenCalledWith(API_BASE_URL, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(newTaskData)
  //   });
  // });

  // it("createTask should throw an error on failure", async () => {
  //   const newTaskData = { title: "New Task", description: "New Description" };

  //   fetch.mockResolvedValueOnce({
  //     ok: false,
  //     statusText: "Server Error"
  //   });

  //   await expect(createTask(newTaskData)).rejects.toThrow(
  //     "Network response was not ok"
  //   );
  // });

  // it("completeTask should mark task as complete and return updated task", async () => {
  //   const mockCompletedTask = {
  //     id: "1",
  //     title: "Test Task",
  //     description: "Description",
  //     status: "completed"
  //   };

  //   fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => mockCompletedTask
  //   });

  //   const updatedTask = await completeTask("1");

  //   expect(updatedTask).toEqual(mockCompletedTask);
  //   expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/1/complete`, {
  //     method: "PUT"
  //   });
  // });

  // it("completeTask should throw an error on failure", async () => {
  //   fetch.mockResolvedValueOnce({
  //     ok: false,
  //     statusText: "Failed to complete task"
  //   });

  //   await expect(completeTask("1")).rejects.toThrow(
  //     "Network response was not ok"
  //   );
  // });
});
