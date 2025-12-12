// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/theme.css';


// Use createRoot to mount the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This line correctly renders the App component with your router */}
    <App /> 
  </React.StrictMode>,
);