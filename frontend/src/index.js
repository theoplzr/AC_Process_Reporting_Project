import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white font-poppins animate-fadeIn">
      <App />
    </div>
  </React.StrictMode>
);

reportWebVitals();
