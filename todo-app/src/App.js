import React, { useState, useEffect } from 'react';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import ThemeToggle from './ThemeToggle';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [themeLoading, setThemeLoading] = useState(false);
  
  // For now, we're using a hardcoded username - later this will come from login
  const currentUsername = 'user1';

  // Fetch user data and apply theme on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch(`http://localhost:3001/users/${currentUsername}`);
        const userData = await res.json();
        setUser(userData);
        setIsDarkMode(userData.dark_mode);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to light mode if there's an error
        setIsDarkMode(false);
      }
    }

    fetchUserData();
  }, [currentUsername]);

  // Fetch tasks
  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch('http://localhost:3001/tasks/getall');
      const data = await res.json();
      setTasks(data);
    }

    fetchTasks();
  }, []);

  // Apply theme to body whenever isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = async () => {
    if (!user) return;
    
    setThemeLoading(true);
    const newThemeValue = !isDarkMode;
    
    try {
      // Update the database
      const res = await fetch(`http://localhost:3001/users/theme/${currentUsername}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dark_mode: newThemeValue }),
      });
      
      const updatedUser = await res.json();
      
      // Update local state
      setUser(updatedUser);
      setIsDarkMode(updatedUser.dark_mode);
      
      console.log(`Theme updated to: ${updatedUser.dark_mode ? 'Dark' : 'Light'} Mode`);
    } catch (error) {
      console.error('Error updating theme:', error);
    } finally {
      setThemeLoading(false);
    }
  };

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
        <div className="header-content">
          <div className="header-left">
            <h1>My To-Do List</h1>
           
          </div>
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            onToggle={toggleTheme}
            isLoading={themeLoading}
          />
        </div>
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