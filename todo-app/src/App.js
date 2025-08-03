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
      const res = await fetch('http://localhost:3001/tasks/getall');
      const data = await res.json();
      setTasks(data);
    }

    fetchTasks();
  }, []);

  const addTask = async (taskText) => {
    console.log('addTask called with:', taskText);
    
    try {
      const res = await fetch('http://localhost:3001/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: taskText }),
      });
      
      const responseText = await res.text();
      
      const newTask = JSON.parse(responseText);
      
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const res = await fetch(`http://localhost:3001/tasks/update/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      
      const updatedTask = await res.json();
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await fetch(`http://localhost:3001/tasks/delete/${taskId}`, {
          method: 'DELETE',
        });
        
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
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
