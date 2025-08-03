import React, { useState, useEffect } from 'react';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch('http://localhost:3001/tasks');
      const data = await res.json();
      setTasks(data);
    }

    fetchTasks();
  }, []);

  const addTask = async (taskText) => {
    console.log('addTask called with:', taskText);
    
    try {
      const res = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: taskText }),
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      // Get the response as text first to see what we're actually getting
      const responseText = await res.text();
      console.log('Raw response:', responseText);
      
      // Try to parse as JSON
      const newTask = JSON.parse(responseText);
      console.log('Parsed task:', newTask);
      
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
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
