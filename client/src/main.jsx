import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Apply light mode class synchronously before first paint so there's no flash
if (localStorage.getItem('darkMode') === 'false') {
  document.documentElement.classList.add('light');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
