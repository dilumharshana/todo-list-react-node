require("dotenv").config();
const request = require("supertest");
const app = require("../../src/app");
const { pool } = require("../../src/config/db");

// Mock the database connection
jest.mock("../../src/config/db", () => {
  const mockPool = {
    query: jest.fn(),
    getConnection: jest.fn().mockResolvedValue({
      release: jest.fn()
    })
  };
  return { pool: mockPool, testConnection: jest.fn().mockResolvedValue(true) };
});

describe("Task API Integration Tests", () => {
  beforeEach(async () => {
    // Reset mock DB or insert a mock task with ID 1
    pool.query.mockClear(); // if using a mock
    pool.query.mockImplementation((query, params) => {
      if (
        query.includes("SELECT * FROM tasks WHERE id = ?") &&
        params[0] === 1
      ) {
        return Promise.resolve([
          [
            {
              id: 1,
              title: "New Task",
              description: "Description",
              completed: false
            }
          ]
        ]);
      }
      if (query.includes("INSERT INTO tasks")) {
        return Promise.resolve([{ insertId: 1 }]);
      }
      return Promise.resolve([[]]);
    });
    await pool.query("DELETE FROM tasks"); // Clean up before each test
    await pool.query(
      "INSERT INTO tasks (id, title, description, completed) VALUES (1, 'Test Task', 'Test Desc', false)"
    );
  });

  afterEach(async () => {
    await pool.query("DELETE FROM tasks"); // Clean up after each test
  });

  describe("GET /api/tasks", () => {
    it("should return recent tasks", async () => {
      // Mock database response
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
      pool.query.mockResolvedValueOnce([mockTasks]);

      // Make request
      const response = await request(app).get("/api/tasks");

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM tasks"),
        expect.arrayContaining([5])
      );
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      // Mock data
      const taskData = { title: "New Task", description: "Description" };
      const mockInsertResult = { insertId: 1 };
      const createdTask = { id: 1, ...taskData, completed: false };

      // Mock database responses
      pool.query.mockResolvedValueOnce([mockInsertResult]);
      pool.query.mockResolvedValueOnce([[createdTask]]);

      // Make request
      const response = await request(app)
        .post("/api/tasks")
        .send(taskData)
        .set("Content-Type", "application/json");

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdTask);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO tasks"),
        expect.arrayContaining([taskData.title, taskData.description])
      );
    });

    it("should return 400 for invalid input", async () => {
      // Make request with invalid data
      const response = await request(app)
        .post("/api/tasks")
        .send({ title: "" })
        .set("Content-Type", "application/json");

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });
});
