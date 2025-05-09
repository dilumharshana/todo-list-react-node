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

            {/* User Profile Section */}
            <div className="user-info">
              <div className="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="user-details">
                <p className="user-name">Task Manager</p>
                <p className="user-role">Organize your day</p>
              </div>
            </div>

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