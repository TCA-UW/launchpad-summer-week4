import React, { useState } from 'react';

function AddTaskForm({ onAddTask }) {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (task.trim()) {
      
      const newTask = {
        id: Date.now(),
        text: task.trim(),
        completed: false
      };
      
      onAddTask(newTask);
      
      setTask('');
    }
  };

  return (
    <div className="add-task-form">
      <div className="form-group">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task..."
          className="task-input"
          onKeyUp={(e) => e.key === 'Enter' && handleSubmit(e)}
        />
        <button onClick={handleSubmit} className="add-button">
          Add Task
        </button>
      </div>
    </div>
  );
}

export default AddTaskForm;