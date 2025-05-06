const { pool } = require("../config/db");

/**
 * Task model - Handles database operations for tasks
 */
class Task {
  /**
   * Find recent uncompleted tasks
   * @param {number} limit - Number of tasks to return (default 5)
   * @returns {Promise<Array>} - Array of tasks
   */
  static async findRecent(limit = 5) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM tasks 
         WHERE completed = false 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [limit]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error finding recent tasks: ${error.message}`);
    }
  }

  /**
   * Find a task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object|null>} - Task object or null if not found
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error finding task by ID: ${error.message}`);
    }
  }

  /**
   * Create a new task
   * @param {Object} taskData - Task data (title, description)
   * @returns {Promise<Object>} - Created task object
   */
  static async create(taskData) {
    try {
      const { title, description } = taskData;
      const [result] = await pool.query(
        "INSERT INTO tasks (title, description) VALUES (?, ?)",
        [title, description]
      );

      const id = result.insertId;
      return this.findById(id);
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {Object} taskData - Task data to update
   * @returns {Promise<Object|null>} - Updated task object or null if not found
   */
  static async update(id, taskData) {
    try {
      const { title, description, completed } = taskData;

      const [result] = await pool.query(
        `UPDATE tasks 
         SET title = IFNULL(?, title), 
             description = IFNULL(?, description), 
             completed = IFNULL(?, completed) 
         WHERE id = ?`,
        [title, description, completed, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }
  }

  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {Promise<boolean>} - Whether deletion was successful
   */
  static async delete(id) {
    try {
      const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }
}

module.exports = Task;
