require("dotenv").config();
const TaskController = require("../../../src/controllers/taskController");
const TaskService = require("../../../src/services/taskService");

// Mock the TaskService
jest.mock("../../../src/services/taskService");

describe("TaskController", () => {
  // Setup mock request and response objects
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn()
    };

    mockNext = jest.fn();

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("getRecentTasks", () => {
    it("should return recent tasks with status 200", async () => {
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
      TaskService.getRecentTasks.mockResolvedValue(mockTasks);

      // Call the controller
      await TaskController.getRecentTasks(mockReq, mockRes, mockNext);

      // Assertions
      expect(TaskService.getRecentTasks).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass errors to next middleware", async () => {
      // Setup mock to throw error
      const mockError = new Error("Service error");
      TaskService.getRecentTasks.mockRejectedValue(mockError);

      // Call the controller
      await TaskController.getRecentTasks(mockReq, mockRes, mockNext);

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe("createTask", () => {
    it("should create a task and return status 201", async () => {
      // Mock data
      const taskData = { title: "New Task", description: "Description" };
      const createdTask = { id: 1, ...taskData, completed: false };

      // Setup request
      mockReq.body = taskData;

      // Setup mock
      TaskService.createTask.mockResolvedValue(createdTask);

      // Call the controller
      await TaskController.createTask(mockReq, mockRes, mockNext);

      // Assertions
      expect(TaskService.createTask).toHaveBeenCalledWith(taskData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdTask);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass errors to next middleware", async () => {
      // Setup mock to throw error
      const mockError = new Error("Service error");
      TaskService.createTask.mockRejectedValue(mockError);

      // Call the controller
      await TaskController.createTask(mockReq, mockRes, mockNext);

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("updateTask", () => {
    it("should update a task and return status 200", async () => {
      // Mock data
      const taskId = 1;
      const taskData = { title: "Updated Task" };
      const updatedTask = { id: taskId, ...taskData, completed: false };

      // Setup request
      mockReq.params.id = taskId.toString();
      mockReq.body = taskData;

      // Setup mock
      TaskService.updateTask.mockResolvedValue(updatedTask);

      // Call the controller
      await TaskController.updateTask(mockReq, mockRes, mockNext);

      // Assertions
      expect(TaskService.updateTask).toHaveBeenCalledWith(taskId, taskData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedTask);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid ID", async () => {
      // Setup request with invalid ID
      mockReq.params.id = "invalid";

      // Call the controller
      await TaskController.updateTask(mockReq, mockRes, mockNext);

      // Assertions
      expect(TaskService.updateTask).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass errors to next middleware", async () => {
      // Setup request
      mockReq.params.id = "1";

      // Setup mock to throw error
      const mockError = new Error("Service error");
      TaskService.updateTask.mockRejectedValue(mockError);

      // Call the controller
      await TaskController.updateTask(mockReq, mockRes, mockNext);

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("completeTask", () => {
    it("should complete a task and return status 200", async () => {
      // Mock data
      const taskId = 1;
      const completedTask = { id: taskId, title: "Task", completed: true };

      // Setup request
      mockReq.params.id = taskId.toString();

      // Setup mock
      TaskService.completeTask.mockResolvedValue(completedTask);

      // Call the controller
      await TaskController.completeTask(mockReq, mockRes, mockNext);

      // Assertions
      expect(TaskService.completeTask).toHaveBeenCalledWith(taskId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(completedTask);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid ID", async () => {
      // Setup request with invalid ID
      mockReq.params.id = "invalid";

      // Call the controller
      await TaskController.completeTask(mockReq, mockRes, mockNext);

      // Assertions
      expect(TaskService.completeTask).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass errors to next middleware", async () => {
      // Setup request
      mockReq.params.id = "1";

      // Setup mock to throw error
      const mockError = new Error("Service error");
      TaskService.completeTask.mockRejectedValue(mockError);

      // Call the controller
      await TaskController.completeTask(mockReq, mockRes, mockNext);

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
