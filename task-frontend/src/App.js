import React, { useEffect, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/tasks/';

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .app {
    min-height: 100vh;
    transition: all 0.5s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .app.light {
    background: linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 50%, #f3e5f5 100%);
    color: #1f2937;
  }

  .app.dark {
    background: linear-gradient(135deg, #111827 0%, #581c87 50%, #7c3aed 100%);
    color: white;
  }

  .bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .bg-blur-1 {
    position: absolute;
    top: -160px;
    right: -160px;
    width: 320px;
    height: 320px;
    background: rgba(168, 85, 247, 0.1);
    border-radius: 50%;
    filter: blur(80px);
  }

  .bg-blur-2 {
    position: absolute;
    bottom: -160px;
    left: -160px;
    width: 320px;
    height: 320px;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 50%;
    filter: blur(80px);
  }

  .container {
    position: relative;
    z-index: 10;
    max-width: 1024px;
    margin: 0 auto;
    padding: 32px 16px;
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
  }

  .header-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .header-controls div:first-child {
    width: 60px;
  }

  .main-title {
    font-size: 3rem;
    font-weight: bold;
    background: linear-gradient(135deg, #9333ea, #ec4899, #2563eb);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .theme-toggle {
    padding: 12px;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .theme-toggle.light {
    background: rgba(168, 85, 247, 0.2);
    color: #9333ea;
  }

  .theme-toggle.dark {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  }

  .theme-toggle:hover {
    transform: scale(1.1);
  }

  .subtitle {
    font-size: 1.125rem;
    opacity: 0.8;
  }

  .card {
    backdrop-filter: blur(16px);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 32px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 1px solid;
  }

  .card.light {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(147, 51, 234, 0.2);
  }

  .card.dark {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .add-task-form {
    display: flex;
    gap: 16px;
  }

  .add-task-input {
    flex: 1;
    padding: 16px 24px;
    border-radius: 12px;
    border: 2px solid;
    font-size: 1.125rem;
    transition: all 0.3s ease;
    outline: none;
  }

  .add-task-input.light {
    background: white;
    border-color: #d1d5db;
    color: #1f2937;
  }

  .add-task-input.light::placeholder {
    color: #6b7280;
  }

  .add-task-input.light:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  }

  .add-task-input.dark {
    background: rgba(31, 41, 55, 0.5);
    border-color: #4b5563;
    color: white;
  }

  .add-task-input.dark::placeholder {
    color: #9ca3af;
  }

  .add-task-input.dark:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  }

  .add-btn {
    padding: 16px 32px;
    background: linear-gradient(135deg, #9333ea, #ec4899);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .add-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.3);
  }

  .add-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stat-card {
    backdrop-filter: blur(16px);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid;
  }

  .stat-card.blue {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.3);
  }

  .stat-card.green {
    background: rgba(34, 197, 94, 0.2);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .stat-card.orange {
    background: rgba(249, 115, 22, 0.2);
    border-color: rgba(249, 115, 22, 0.3);
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .stat-number.blue {
    color: #3b82f6;
  }

  .stat-number.green {
    color: #22c55e;
  }

  .stat-number.orange {
    color: #f97316;
  }

  .stat-label {
    opacity: 0.8;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .tasks-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .task-item {
    backdrop-filter: blur(16px);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border: 1px solid;
    transition: all 0.3s ease;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .task-item:hover {
    transform: scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .task-item.pending.light {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(209, 213, 219, 0.8);
  }

  .task-item.pending.dark {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .task-item.completed {
    opacity: 0.75;
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
  }

  .task-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .task-checkbox {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
  }

  .task-checkbox.pending.light {
    border-color: #9ca3af;
    background: transparent;
  }

  .task-checkbox.pending.dark {
    border-color: #6b7280;
    background: transparent;
  }

  .task-checkbox.pending:hover {
    border-color: #22c55e;
    background: rgba(34, 197, 94, 0.2);
    transform: scale(1.1);
  }

  .task-checkbox.completed {
    background: #22c55e;
    border-color: #22c55e;
    color: white;
  }

  .task-checkbox.completed:hover {
    transform: scale(1.1);
  }

  .task-title {
    flex: 1;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .task-title.completed {
    text-decoration: line-through;
    opacity: 0.6;
  }

  .task-title.pending:hover {
    color: #8b5cf6;
  }

  .edit-form {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .edit-input {
    flex: 1;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid;
    font-size: 1rem;
    transition: all 0.3s ease;
    outline: none;
  }

  .edit-input.light {
    background: white;
    border-color: #d1d5db;
    color: #1f2937;
  }

  .edit-input.light:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }

  .edit-input.dark {
    background: rgba(31, 41, 55, 0.5);
    border-color: #4b5563;
    color: white;
  }

  .edit-input.dark:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.5);
  }

  .task-actions {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    padding: 8px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .action-btn:hover {
    transform: scale(1.1);
  }

  .action-btn.edit.light {
    background: rgba(59, 130, 246, 0.2);
    color: #2563eb;
  }

  .action-btn.edit.dark {
    background: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
  }

  .action-btn.edit:hover {
    background: rgba(59, 130, 246, 0.3);
  }

  .action-btn.delete.light {
    background: rgba(239, 68, 68, 0.2);
    color: #dc2626;
  }

  .action-btn.delete.dark {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
  }

  .action-btn.delete:hover {
    background: rgba(239, 68, 68, 0.3);
  }

  .action-btn.save {
    background: #22c55e;
    color: white;
  }

  .action-btn.save:hover {
    background: #16a34a;
  }

  .action-btn.cancel {
    background: #6b7280;
    color: white;
  }

  .action-btn.cancel:hover {
    background: #4b5563;
  }

  .empty-state {
    text-align: center;
    padding: 64px 0;
  }

  .empty-icon {
    font-size: 5rem;
    margin-bottom: 24px;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .empty-subtitle {
    font-size: 1.125rem;
    opacity: 0.8;
  }

  .loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    width: 64px;
    height: 64px;
    border: 4px solid;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner.light {
    border-color: #8b5cf6;
    border-top-color: transparent;
  }

  .spinner.dark {
    border-color: #8b5cf6;
    border-top-color: transparent;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .section {
    margin-bottom: 32px;
  }
`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks on startup
  const loadTasks = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Add task
  const addTask = () => {
    if (!newTitle.trim()) return;
    
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    })
      .then(() => {
        setNewTitle('');
        loadTasks();
      });
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`${API_URL}${id}/`, { method: 'DELETE' })
      .then(() => loadTasks());
  };

  // Toggle task status
  const toggleComplete = (task) => {
    fetch(`${API_URL}${task._id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: task.title, completed: !task.completed })
    })
      .then(() => loadTasks());
  };

  // Start editing
  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  // Save edited task
  const saveEdit = (task) => {
    if (!editTitle.trim()) return;
    
    fetch(`${API_URL}${task._id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, completed: task.completed })
    })
      .then(() => {
        setEditId(null);
        setEditTitle('');
        loadTasks();
      });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape' && editId) {
      cancelEdit();
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  const themeClass = darkMode ? 'dark' : 'light';

  if (isLoading) {
    return (
      <>
        <style>{styles}</style>
        <div className={`loading app ${themeClass}`}>
          <div className={`spinner ${themeClass}`}></div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className={`app ${themeClass}`}>
        {/* Background decoration */}
        <div className="bg-decoration">
          <div className="bg-blur-1"></div>
          <div className="bg-blur-2"></div>
        </div>

        <div className="container">
          {/* Header */}
          <div className="header">
            <div className="header-controls">
              <div></div>
              <h1 className="main-title">Task Manager</h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`theme-toggle ${themeClass}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
            <p className="subtitle">Organize your life, one task at a time</p>
          </div>

          {/* Add task section */}
          <div className={`card ${themeClass}`}>
            <div className="add-task-form">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTask)}
                placeholder="What needs to be done?"
                className={`add-task-input ${themeClass}`}
              />
              <button
                onClick={addTask}
                disabled={!newTitle.trim()}
                className="add-btn"
              >
                ➕ Add Task
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-number blue">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card green">
              <div className="stat-number green">{completedTasks.length}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-number orange">{pendingTasks.length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          {/* Tasks sections */}
          <div>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="section">
                <h2 className="section-title">
                  📋 Pending Tasks ({pendingTasks.length})
                </h2>
                <div className="tasks-list">
                  {pendingTasks.map((task) => (
                    <div key={task._id} className={`task-item pending ${themeClass}`}>
                      <div className="task-content">
                        <button
                          onClick={() => toggleComplete(task)}
                          className={`task-checkbox pending ${themeClass}`}
                        />
                        
                        {editId === task._id ? (
                          <div className="edit-form">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, () => saveEdit(task))}
                              className={`edit-input ${themeClass}`}
                              autoFocus
                            />
                            <button
                              onClick={() => saveEdit(task)}
                              className="action-btn save"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="action-btn cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <span
                              onClick={() => startEdit(task)}
                              className={`task-title pending`}
                            >
                              {task.title}
                            </span>
                            <div className="task-actions">
                              <button
                                onClick={() => startEdit(task)}
                                className={`action-btn edit ${themeClass}`}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deleteTask(task._id)}
                                className={`action-btn delete ${themeClass}`}
                              >
                                🗑️
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="section">
                <h2 className="section-title">
                  ✅ Completed Tasks ({completedTasks.length})
                </h2>
                <div className="tasks-list">
                  {completedTasks.map((task) => (
                    <div key={task._id} className="task-item completed">
                      <div className="task-content">
                        <button
                          onClick={() => toggleComplete(task)}
                          className="task-checkbox completed"
                        >
                          ✓
                        </button>
                        
                        <span className="task-title completed">
                          {task.title}
                        </span>
                        
                        <button
                          onClick={() => deleteTask(task._id)}
                          className={`action-btn delete ${themeClass}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {tasks.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h3 className="empty-title">No tasks yet!</h3>
                <p className="empty-subtitle">Add your first task above to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;