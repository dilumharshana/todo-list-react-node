import React, { Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { TaskListProps } from '../types';
import ErrorFallback from './ErrorFallback';
import TaskList from './TaskList';

// style imports 
import '../styles/TaskList.css';

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