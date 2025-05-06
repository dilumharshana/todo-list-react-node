/**
 * Validates task input data
 * @param {Object} taskData - Task data to validate
 * @returns {Object} - Validation result with error or validated value
 */
const validateTaskInput = (taskData) => {
  const { title, description } = taskData;
  const errors = [];
  const validatedData = {};

  // Validate title
  if (!title) {
    errors.push("Title is required");
  } else if (typeof title !== "string") {
    errors.push("Title must be a string");
  } else if (title.trim().length === 0) {
    errors.push("Title cannot be empty");
  } else if (title.length > 100) {
    errors.push("Title cannot exceed 100 characters");
  } else {
    validatedData.title = title.trim();
  }

  // Validate description
  if (description !== undefined) {
    if (typeof description !== "string") {
      errors.push("Description must be a string");
    } else {
      validatedData.description = description.trim();
    }
  } else {
    validatedData.description = "";
  }

  // Return validation result
  if (errors.length > 0) {
    return {
      error: new Error(errors.join(". ")),
      value: null
    };
  }

  return {
    error: null,
    value: validatedData
  };
};

/**
 * Validates task ID
 * @param {any} id - Task ID to validate
 * @returns {Object} - Validation result with error or validated value
 */
const validateTaskId = (id) => {
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return {
      error: new Error("Invalid task ID"),
      value: null
    };
  }

  return {
    error: null,
    value: parsedId
  };
};

module.exports = {
  validateTaskInput,
  validateTaskId
};
