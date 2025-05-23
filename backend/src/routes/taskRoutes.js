const express = require("express");
const TaskController = require("../controllers/taskController");

const router = express.Router();

/**
 * @route   GET /api/tasks
 * @desc    Get recent uncompleted tasks
 * @access  Public
 */
router.get("/tasks", TaskController.getRecentTasks);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post("/tasks", TaskController.createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Public
 */
router.put("/:id", TaskController.updateTask);

/**
 * @route   PUT /api/tasks/:id/complete
 * @desc    Mark a task as completed
 * @access  Public
 */
router.put("/:id/complete", TaskController.completeTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Public
 */
router.delete("/:id", TaskController.deleteTask);

module.exports = router;
