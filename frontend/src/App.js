// src/App.js
import React, { useState } from 'react';
import PlanUploader from './components/PlanUploader';
import PlanViewer from './components/PlanViewer';
import './css/App.css'; // Si tu utilises Tailwind ou des styles personnalisés

function App() {
  const [planUrl, setPlanUrl] = useState(null);

  const handleUpload = (plan) => {
    setPlanUrl(plan.imagePath);
  };

  return (
    <div className="App">
      <h1>Gestion du Plan d'Incinérateur</h1>
      {!planUrl ? (
        <PlanUploader onUpload={handleUpload} />
      ) : (
        <PlanViewer planUrl={planUrl} />
      )}
    </div>
  );
}

export default App;
