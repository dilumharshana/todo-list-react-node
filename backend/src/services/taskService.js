const Task = require("../models/Task");
const { validateTaskInput } = require("../utils/validators");

/**
 * Task Service - Business logic for task operations
 */
class TaskService {
  /**
   * Get recent uncompleted tasks
   * @param {number} limit - Number of tasks to return
   * @returns {Promise<Array>} - Array of tasks
   */
  static async getRecentTasks(limit = 5) {
    return await Task.findRecent(limit);
  }

  /**
   * Get a task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} - Task object
   * @throws {Error} - If task not found
   */
  static async getTaskById(id) {
    const task = await Task.findById(id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} - Created task
   * @throws {Error} - If validation fails
   */
  static async createTask(taskData) {
    // Validate input
    const { error, value } = validateTaskInput(taskData);

    if (error) {
      const validationError = new Error(error.message);
      validationError.statusCode = 400;
      throw validationError;
    }

    // Create task
    return await Task.create(value);
  }

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {Object} taskData - Task data to update
   * @returns {Promise<Object>} - Updated task
   * @throws {Error} - If task not found or validation fails
   */
  static async updateTask(id, taskData) {
    // First check if task exists
    await this.getTaskById(id);

    // Update task
    const updatedTask = await Task.update(id, taskData);

    return updatedTask;
  }

  /**
   * Mark a task as completed
   * @param {number} id - Task ID
   * @returns {Promise<Object>} - Updated task
   * @throws {Error} - If task not found
   */
  static async completeTask(id) {
    // First check if task exists
    await this.getTaskById(id);

    // Mark as completed
    return await Task.update(id, { completed: true });
  }

  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {Promise<boolean>} - Whether deletion was successful
   * @throws {Error} - If task not found
   */
  static async deleteTask(id) {
    // First check if task exists
    await this.getTaskById(id);

    // Delete task
    return await Task.delete(id);
  }
}

module.exports = TaskService;
