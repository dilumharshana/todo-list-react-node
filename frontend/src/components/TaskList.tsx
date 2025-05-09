import React, { lazy, Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { type Task } from '../types';
import { fetchRecentTasks, completeTask } from '../services/taskService';
import '../styles/TaskList.css';

const TaskCard = lazy(() => import('./TaskCard'));

interface TaskListProps {
    refreshTrigger: number;
}

const TaskCardFallback = () => (
    <div className="task-card-skeleton">
        <div className="skeleton-title"></div>
        <div className="skeleton-description"></div>
    </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="error">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary} className="retry-button">Try again</button>
    </div>
);

const TaskList: React.FC<TaskListProps> = ({ refreshTrigger }) => {
    const queryClient = useQueryClient();

    const { data: tasks = [] as Task[] } = useQuery<Task[], Error>({
        queryKey: ['tasks', refreshTrigger],
        queryFn: fetchRecentTasks,
    });

    const handleCompleteTask = async (taskId: string) => {
        try {
            await completeTask(taskId);

            queryClient.setQueryData(['tasks', refreshTrigger], (oldData: Task[] | undefined) =>
                oldData ? oldData.filter(task => task.id !== taskId) : []
            );
        } catch (err) {
            console.error('Error completing task:', err);
        }
    };

    if (tasks.length === 0) {
        return <div className="no-tasks">No tasks found. Add a new task to get started!</div>;
    }

    return (
        <>
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
        </>
    );
};

const TaskListWithSuspense: React.FC<TaskListProps> = (props) => {
    const queryClient = useQueryClient();

    const handleReset = () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={handleReset}
        >
            <Suspense fallback={<div className="loading">Loading tasks...</div>}>
                <TaskList {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default TaskListWithSuspense;