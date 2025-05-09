require("dotenv").config();

const TaskService = require("../../../src/services/taskService");
const Task = require("../../../src/models/task");

// Mock the Task model
jest.mock("../../../src/models/Task");

describe("TaskService", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRecentTasks", () => {
    it("should return recent tasks", async () => {
      // Mock data
      const mockTasks = [
        {
          id: 1,
          title: "Task 1",
          description: "Description 1",
          completed: false
        },
        {
          id: 2,
          title: "Task 2",
          description: "Description 2",
          completed: false
        }
      ];

      // Setup mock
      Task.findRecent.mockResolvedValue(mockTasks);

      // Call the service
      const result = await TaskService.getRecentTasks();

      // Assertions
      expect(Task.findRecent).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockTasks);
    });

    it("should handle errors", async () => {
      // Setup mock to throw error
      const mockError = new Error("Database error");
      Task.findRecent.mockRejectedValue(mockError);

      // Call the service and expect it to throw
      await expect(TaskService.getRecentTasks()).rejects.toThrow(mockError);
    });
  });

  describe("createTask", () => {
    it("should create a task with valid data", async () => {
      // Mock data
      const taskData = { title: "New Task", description: "Description" };
      const createdTask = { id: 1, ...taskData, completed: false };

      // Setup mock
      Task.create.mockResolvedValue(createdTask);

      // Call the service
      const result = await TaskService.createTask(taskData);

      // Assertions
      expect(Task.create).toHaveBeenCalledWith(
        expect.objectContaining(taskData)
      );
      expect(result).toEqual(createdTask);
    });

    it("should throw validation error with invalid data", async () => {
      // Call the service with invalid data and expect it to throw
      try {
        await TaskService.createTask({ title: "" });
        fail("Expected error to be thrown");
      } catch (error) {
        expect(error.message).toContain("Title is required");
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      // Mock data
      const taskId = 1;
      const taskData = { title: "Updated Task" };
      const existingTask = {
        id: taskId,
        title: "Original Task",
        description: "Description",
        completed: false
      };
      const updatedTask = { ...existingTask, ...taskData };

      // Setup mocks
      Task.findById.mockResolvedValue(existingTask);
      Task.update.mockResolvedValue(updatedTask);

      // Call the service
      const result = await TaskService.updateTask(taskId, taskData);

      // Assertions
      expect(Task.findById).toHaveBeenCalledWith(taskId);
      expect(Task.update).toHaveBeenCalledWith(taskId, taskData);
      expect(result).toEqual(updatedTask);
    });

    it("should throw error if task not found", async () => {
      // Setup mock to return null (task not found)
      Task.findById.mockResolvedValue(null);

      // Call the service and expect it to throw
      await expect(
        TaskService.updateTask(999, { title: "Updated" })
      ).rejects.toThrow("Task not found");
    });
  });

  describe("completeTask", () => {
    it("should mark a task as completed", async () => {
      // Mock data
      const taskId = 1;
      const existingTask = {
        id: taskId,
        title: "Task",
        description: "Description",
        completed: false
      };
      const completedTask = { ...existingTask, completed: true };

      // Setup mocks
      Task.findById.mockResolvedValue(existingTask);
      Task.update.mockResolvedValue(completedTask);

      // Call the service
      const result = await TaskService.completeTask(taskId);

      // Assertions
      expect(Task.findById).toHaveBeenCalledWith(taskId);
      expect(Task.update).toHaveBeenCalledWith(taskId, { completed: true });
      expect(result).toEqual(completedTask);
    });

    it("should throw error if task not found", async () => {
      // Setup mock to return null (task not found)
      Task.findById.mockResolvedValue(null);

      // Call the service and expect it to throw
      await expect(TaskService.completeTask(999)).rejects.toThrow(
        "Task not found"
      );
    });
  });
});
