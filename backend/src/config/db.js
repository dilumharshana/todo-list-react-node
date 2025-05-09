const mysql = require("mysql2/promise");

// Database connection configuration
const dbConfig = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  queueLimit: 0
};

// Create a pool connection
const pool = mysql.createPool(dbConfig);

// Function to test the database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    ("Database connection established successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    return false;
  }
};

// Initialize connection on import
(async () => {
  if (process.env.NODE_ENV !== "test") {
    await testConnection();
  }
})();

module.exports = {
  pool,
  testConnection
};
