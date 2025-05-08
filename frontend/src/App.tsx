import React, { useState } from 'react';
import AddTaskForm from './components/AddTaskForm';
import Header from './components/Header';
import TaskList from './components/TaskList';
import './styles/App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleTaskAdded = () => {
    // Trigger a refresh of the task list
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <Header />
        <div className="content-container">
          <div className="add-task-section">
            <AddTaskForm onTaskAdded={handleTaskAdded} />
          </div>
          <div className="task-list-section">
            <TaskList refreshTrigger={refreshKey} />
          </div>
        </div>
      </div>
    </QueryClientProvider>

  );
};

export default App;