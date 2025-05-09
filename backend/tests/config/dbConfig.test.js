// dbConfig.test.js

const mysql = require("mysql2/promise");
const DatabaseConnection = require("../../src/config/db"); // Adjust the import path if necessary

jest.mock("mysql2/promise", () => ({
  createPool: jest.fn().mockReturnValue({
    getConnection: jest.fn().mockResolvedValue({
      release: jest.fn()
    })
  })
}));

describe("DatabaseConnection", () => {
  let dbConnection;

  beforeEach(() => {
    // Clear any previous mocks and spy on console.error
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error to suppress actual logging
  });

  afterEach(() => {
    // Reset mocks after each test
    console.error.mockRestore();
  });

  it("should create only one instance of DatabaseConnection (Singleton)", () => {
    // Get the first instance
    const instance1 = DatabaseConnection.getInstance();
    // Get the second instance
    const instance2 = DatabaseConnection.getInstance();

    // Check if both instances are the same (Singleton)
    expect(instance1).toBe(instance2);
  });

  it("should test the database connection successfully", async () => {
    dbConnection = DatabaseConnection.getInstance();

    // Mocking the behavior of getConnection to resolve successfully
    const mockRelease = jest.fn();
    mysql.createPool().getConnection.mockResolvedValueOnce({
      release: mockRelease
    });

    const result = await dbConnection.testConnection();

    // Check that the connection was successful and release was called
    expect(result).toBe(true);
    expect(mockRelease).toHaveBeenCalledTimes(1);
    expect(mysql.createPool().getConnection).toHaveBeenCalledTimes(1);
  });

  it("should handle failure in database connection", async () => {
    dbConnection = DatabaseConnection.getInstance();

    // Mocking the behavior of getConnection to throw an error
    mysql
      .createPool()
      .getConnection.mockRejectedValueOnce(new Error("Connection failed"));

    const result = await dbConnection.testConnection();

    // Check that the connection failed and error was logged
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      "Unable to connect to the database:",
      "Connection failed"
    );
  });

  it("should ensure the pool is initialized correctly", () => {
    dbConnection = DatabaseConnection.getInstance();

    // Check if the pool is initialized and if the connection pool method exists
    expect(dbConnection.pool).toBeDefined();
    expect(typeof dbConnection.pool.getConnection).toBe("function");
  });
});
