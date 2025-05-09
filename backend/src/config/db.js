const mysql = require("mysql2/promise");

class Database {
  constructor() {
    // Private instance variable
    this._pool = null;

    // Database connection configuration
    this._dbConfig = {
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      queueLimit: 0
    };
  }

  // Static method to get the singleton instance
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Get the pool connection (create if doesn't exist)
  getPool() {
    if (!this._pool) {
      this._pool = mysql.createPool(this._dbConfig);
    }
    return this._pool;
  }

  // Function to test the database connection
  async testConnection() {
    try {
      const connection = await this.getPool().getConnection();
      console.log("Database connection established successfully");
      connection.release();
      return true;
    } catch (error) {
      console.error("Unable to connect to the database:", error.message);
      return false;
    }
  }
}

// Initialize singleton and connection on import
const db = Database.getInstance();

// Initialize connection on import (except in test environment)
(async () => {
  if (process.env.NODE_ENV !== "test") {
    await db.testConnection();
  }
})();

// For backwards compatibility with existing code that uses pool.query()
module.exports = {
  pool: db.getPool(), // Expose the pool directly for existing code
  getPool: () => db.getPool(), // Method to get the pool
  testConnection: () => db.testConnection() // Expose the test method
};
