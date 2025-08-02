import React, { useState } from 'react';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build a todo app", completed: true },
    { id: 3, text: "Practice JavaScript", completed: false }
  ]);

  const [filter, setFilter] = useState('all');

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const remainingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="App">
      <div className="App-header">
        <h1>My To-Do List</h1>
      </div>
      <div className="todo-container">
        <AddTaskForm onAddTask={addTask} />
        <TaskFilter 
          currentFilter={filter}
          onFilterChange={changeFilter}
        />

        <div className="task-stats">
          Total: {totalTasks} | Completed: {completedTasks} | Remaining: {remainingTasks}
        </div>

        <TaskList 
          tasks={filteredTasks} 
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;