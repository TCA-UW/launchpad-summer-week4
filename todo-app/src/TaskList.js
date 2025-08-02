import React from 'react';

function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks yet. Add one above!</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              className="task-checkbox"
            />
            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
              {task.text}
            </span>
            <button 
              onClick={() => onDeleteTask(task.id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;