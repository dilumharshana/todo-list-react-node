import React from 'react';
import { type Task } from '../types';
import '../styles/TaskCard.css';

interface TaskCardProps {
    task: Task;
    onComplete: (taskId: string) => Promise<void>;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
    const handleComplete = async () => {
        try {
            await onComplete(task.id);
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    return (
        <div className="task-card">
            <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
            </div>
            <button onClick={handleComplete} className="done-button">
                Done
            </button>
        </div>
    );
};

export default TaskCard;