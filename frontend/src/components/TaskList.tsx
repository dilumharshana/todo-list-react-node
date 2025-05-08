import React, { lazy, Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { type Task } from '../types';
import { fetchRecentTasks, completeTask } from '../services/taskService';
import '../styles/TaskList.css';

// Lazy loading this bad boy to speed up initial page load
// Users won't notice the split second delay when they actually see a task
const TaskCard = lazy(() => import('./TaskCard'));

interface TaskListProps {
    refreshTrigger: number;
}

// Just a skeleton while stuff loads - better than a spinner IMO
const TaskCardFallback = () => (
    <div className="task-card-skeleton">
        <div className="skeleton-title"></div>
        <div className="skeleton-description"></div>
    </div>
);

// Had to add this after that weird bug last sprint where tasks would fail silently
// At least now users can retry without refreshing the whole page
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="error">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary} className="retry-button">Try again</button>
    </div>
);

const TaskList: React.FC<TaskListProps> = ({ refreshTrigger }) => {
    // Need this to update cache after marking tasks complete
    const queryClient = useQueryClient();

    // Finally ditched all that useState/useEffect boilerplate!
    // So much cleaner with React Query - thanks Dave for suggesting it
    const { data: tasks = [] } = useQuery({
        queryKey: ['tasks', refreshTrigger],  // Will refetch whenever refreshTrigger changes
        queryFn: fetchRecentTasks,
        suspense: true,  // This is what makes the magic happen with Suspense
    });

    const handleCompleteTask = async (taskId: string) => {
        try {
            await completeTask(taskId);

            // Update the cache directly instead of refetching everything
            // Way faster and avoids that annoying flicker we had before
            queryClient.setQueryData(['tasks', refreshTrigger], (oldData: Task[] | undefined) =>
                oldData ? oldData.filter(task => task.id !== taskId) : []
            );
        } catch (err) {
            // TODO: add proper error handling instead of just logging
            // Left this as-is for now since the PM wants the new UI by Friday
            console.error('Error completing task:', err);
        }
    };

    // Show empty state - designed this based on Figma mockup v3.2
    if (tasks?.length === 0) {
        return <div className="no-tasks">No tasks found. Add a new task to get started!</div>;
    }

    return (
        <>
            {tasks?.map(task => (
                <ErrorBoundary
                    key={task.id}
                    FallbackComponent={ErrorFallback}
                    onReset={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
                >
                    {/* Each card gets its own suspense boundary so one slow card doesn't block the rest */}
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

// Wrapper component for the main loading state
// Not super DRY but makes the error handling cleaner overall
const TaskListWithSuspense: React.FC<TaskListProps> = (props) => {
    // Get queryClient at the component level instead of inside the callback
    const queryClient = useQueryClient();

    // Create the reset handler using the already initialized queryClient
    const handleReset = () => {
        // Force refetch when user hits retry
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={handleReset}
        >
            {/* This shows during initial data fetch - should only flash briefly with good internet */}
            <Suspense fallback={<div className="loading">Loading tasks...</div>}>
                <TaskList {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default TaskListWithSuspense;