import { MAX_TITLE_LENGTH } from "../configs";

// Helper to Validate the title field
export const validateTitle = (value: string): string | undefined => {
  if (!value?.trim()) {
    return "Task title is required";
  }
  if (value?.trim().length < 3) {
    return "Title must be at least 3 characters";
  }
  if (value?.length > MAX_TITLE_LENGTH) {
    return `Title cannot exceed ${MAX_TITLE_LENGTH} characters`;
  }
  return undefined;
};

// Helper to determine character counter class based on length
export const getCharCounterClass = (current: number, max: number) => {
  if (current >= max) return "char-counter limit-reached";
  if (current >= max * 0.8) return "char-counter limit-close";
  return "char-counter";
};
