import React from 'react';

function ThemeToggle({ isDarkMode, onToggle, isLoading }) {
  return (
    <div className="theme-toggle">
      <button 
        onClick={onToggle} 
        className="theme-toggle-button"
        disabled={isLoading}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        <span className="theme-icon">
          {isDarkMode ? '☀️' : '🌙'}
        </span>
        <span className="theme-text">
          {isLoading ? 'Loading...' : (isDarkMode ? 'Light' : 'Dark')}
        </span>
      </button>
    </div>
  );
}

export default ThemeToggle;