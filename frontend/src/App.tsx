import React, { useState } from 'react';
import AddTaskForm from './components/AddTaskForm';
import Header from './components/Header';
import TaskList from './components/TaskList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import all our new styles
import './styles/App.css';
// import './styles/Header.css';
// import './styles/AddTaskForm.css';
// import './styles/TaskCard.css';
// import './styles/TaskList.css';
// import './styles/Navigation.css';

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
        <div className="app-content">
          {/* Sidebar with form */}
          <div className="sidebar">
            <Header />

            {/* Task Form */}
            <div className="add-task-section">
              <AddTaskForm onTaskAdded={handleTaskAdded} />
            </div>
          </div>

          {/* Main content with task list */}
          <div className="main-content">
            <div className="task-list-container">
              <div className="task-list-header">
                <h2 className="task-list-title">My Tasks</h2>
                <div className="task-filter">
                  <button className="filter-button active ">Pending Tasks</button>
                </div>
              </div>

              {/* Task list */}
              <div className="task-list-wrapper">
                <TaskList refreshTrigger={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;