import React from 'react';

import type { Task } from '../types';

// style imports  
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
        <div className="task-card" data-completed={task.completed}>
            <div className="task-status"></div>
            <div className="task-content">
                <div className="task-header">
                    <div className="task-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm7.707 3.707l5-5-1.414-1.414L9 10.586 6.707 8.293 5.293 9.707l3 3a1 1 0 001.414 0z" />
                        </svg>
                        {task.title}
                    </div>
                    <span className="task-badge">{task.completed ? 'Completed' : 'Pending'}</span>
                </div>
                <div className="task-description">
                    {task.description}
                </div>

                {!task.completed && (
                    <div className="task-actions">
                        <button className="done-button" onClick={handleComplete}>Mark as Done</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;