import React, { useState } from 'react';
import PlanUploader from './components/PlanUploader';
import PlanViewer from './components/PlanViewer';
import logo from './img/logo.png'; 

function App() {
  const [planUrl, setPlanUrl] = useState(null);

  const handleUpload = (plan) => {
    setPlanUrl(plan.imagePath);
  };

  return (
    <div className="text-center bg-gray-800 min-h-screen flex flex-col justify-center items-center text-white font-poppins p-5 animate-fadeIn">
      {/* Logo en haut à gauche */}
      <header className="fixed top-0 left-0 p-4">
        <img
          src={logo}
          alt="Logo de l'entreprise"
          className="w-40 h-auto transition-transform duration-200 ease-in-out hover:scale-110"
        />
      </header>

      {/* Contenu principal */}
      <div className="mt-16 flex flex-col items-center">
        <h1 className="text-4xl font-bold">Reporting</h1>
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
