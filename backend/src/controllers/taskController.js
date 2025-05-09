const TaskService = require("../services/taskService");
const { validateTaskId } = require("../utils/validators");

/**
 * Task Controller - Handles HTTP requests for task operations
 */
class TaskController {
  /**
   * Get recent uncompleted tasks
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getRecentTasks(req, res, next) {
    try {
      const tasks = await TaskService.getRecentTasks();
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a task by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  v;

  /**
   * Create a new task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createTask(req, res, next) {
    try {
      const task = await TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateTask(req, res, next) {
    try {
      const { id } = req.params;

      // Validate ID
      const { error, value } = validateTaskId(id);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const updatedTask = await TaskService.updateTask(value, req.body);
      res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark a task as completed
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async completeTask(req, res, next) {
    try {
      const { id } = req.params;

      // Validate ID
      const { error, value } = validateTaskId(id);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const completedTask = await TaskService.completeTask(value);
      res.status(200).json(completedTask);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteTask(req, res, next) {
    try {
      const { id } = req.params;

      // Validate ID
      const { error, value } = validateTaskId(id);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      await TaskService.deleteTask(value);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
