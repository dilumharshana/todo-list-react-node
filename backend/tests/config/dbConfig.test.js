// dbConfig.test.js

const mysql = require("mysql2/promise");

// Mock mysql before requiring the db module
jest.mock("mysql2/promise", () => ({
  createPool: jest.fn().mockReturnValue({
    getConnection: jest.fn().mockResolvedValue({
      release: jest.fn()
    })
  })
}));

// Import the db module after mocking mysql
const db = require("../../src/config/db"); // Adjust the import path if necessary

describe("Database Configuration", () => {
  beforeEach(() => {
    // Clear any previous mocks and spy on console.log and console.error
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {}); // Mock console.log
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    // Reset mocks after each test
    console.log.mockRestore();
    console.error.mockRestore();
  });

  it("should test the database connection successfully", async () => {
    // Mocking the behavior of getConnection to resolve successfully
    const mockRelease = jest.fn();
    mysql.createPool().getConnection.mockResolvedValueOnce({
      release: mockRelease
    });

    const result = await db.testConnection();

    // Check that the connection was successful and release was called
    expect(result).toBe(true);
    expect(mockRelease).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      "Database connection established successfully"
    );
  });

  it("should handle failure in database connection", async () => {
    // Mocking the behavior of getConnection to throw an error
    mysql
      .createPool()
      .getConnection.mockRejectedValueOnce(new Error("Connection failed"));

    const result = await db.testConnection();

    // Check that the connection failed and error was logged
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      "Unable to connect to the database:",
      "Connection failed"
    );
  });
});
