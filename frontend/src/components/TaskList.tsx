import React, { lazy, Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { completeTask, fetchRecentTasks } from '../services/taskService';
import { TaskListProps, type Task } from '../types';
import ErrorFallback from './ErrorFallback';
import TaskCardFallback from './TaskCardFallback';

// style imports  
import '../styles/TaskList.css';

const TaskCard = lazy(() => import('./TaskCard'));;

const TaskList: React.FC<TaskListProps> = ({ refreshTrigger }) => {
    const queryClient = useQueryClient();

    const { data: tasks = [] as Task[] } = useQuery<Task[], Error>({
        queryKey: ['tasks', refreshTrigger],
        queryFn: fetchRecentTasks,
    });

    const handleCompleteTask = async (taskId: string) => {
        try {
            await completeTask(taskId);
            await queryClient.invalidateQueries({ queryKey: ['tasks', refreshTrigger] });
        } catch (err) {
            console.error('Error completing task:', err);
        }
    };


    if (tasks.length === 0) {
        return (
            <div className="no-tasks">
                No tasks found. Add a new task to get started!
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task: Task) => (
                <ErrorBoundary
                    key={task.id}
                    FallbackComponent={ErrorFallback}
                    onReset={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
                >
                    <Suspense fallback={<TaskCardFallback />}>
                        <TaskCard
                            task={task}
                            onComplete={handleCompleteTask}
                        />
                    </Suspense>
                </ErrorBoundary>
            ))}
        </div>
    );
};

export default TaskList;