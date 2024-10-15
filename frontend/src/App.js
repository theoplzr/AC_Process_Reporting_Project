import React, { useState } from 'react';
import PlanUploader from './components/PlanUploader';
import PlanViewer from './components/PlanViewer';
import logo from './img/logo.png'; 
import './css/App.css'; 

function App() {
  const [planUrl, setPlanUrl] = useState(null);

  const handleUpload = (plan) => {
    setPlanUrl(plan.imagePath);
  };

  return (
    <div className="App">
      {/* Logo en haut à gauche */}
      <header className="header">
        <img src={logo} alt="Logo de l'entreprise" className="logo" />
      </header>

      {/* Contenu principal */}
      <div className="main-content">
        <h1 className="main-title">Reporting</h1>
        {!planUrl ? (
          <PlanUploader onUpload={handleUpload} />
        ) : (
          <PlanViewer planUrl={planUrl} />
        )}
      </div>
    </div>
  );
}

export default App;
