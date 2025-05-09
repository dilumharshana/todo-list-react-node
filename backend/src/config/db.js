const mysql = require("mysql2/promise");

class DatabaseConnection {
  // Private static instance to ensure only one instance of the pool is created
  static #instance;

  constructor() {
    // Database connection configuration
    this.dbConfig = {
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      queueLimit: 0
    };
    this.pool = mysql.createPool(this.dbConfig);
  }

  // Method to get the Singleton instance
  static getInstance() {
    if (!DatabaseConnection.#instance) {
      DatabaseConnection.#instance = new DatabaseConnection();
    }
    return DatabaseConnection.#instance;
  }

  // Method to test the database connection
  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      console.log("Database connection established successfully");
      connection.release();
      return true;
    } catch (error) {
      console.error("Unable to connect to the database:", error.message);
      return false;
    }
  }
}

// Initialize connection on import (Singleton instance)
(async () => {
  if (process.env.NODE_ENV !== "test") {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.testConnection();
  }
})();

module.exports = DatabaseConnection;
