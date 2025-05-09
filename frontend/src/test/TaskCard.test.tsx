import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types";

// Mock the Task type and data
const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  completed: false
};

// Create a mock function for onComplete
const mockOnComplete = jest.fn().mockResolvedValue(undefined);

describe("TaskCard Component", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  it("renders task title and description", () => {
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("calls onComplete when the Mark as Done button is clicked", async () => {
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    const button = screen.getByText("Mark as Done");
    fireEvent.click(button);

    expect(mockOnComplete).toHaveBeenCalledWith("1");
  });

  it("shows Pending badge when task is not completed", () => {
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("shows Completed badge when task is completed", () => {
    const completedTask: Task = {
      ...mockTask,
      completed: true
    };

    render(<TaskCard task={completedTask} onComplete={mockOnComplete} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("does not display Mark as Done button when task is completed", () => {
    const completedTask: Task = {
      ...mockTask,
      completed: true
    };

    render(<TaskCard task={completedTask} onComplete={mockOnComplete} />);

    expect(screen.queryByText("Mark as Done")).not.toBeInTheDocument();
  });
});
