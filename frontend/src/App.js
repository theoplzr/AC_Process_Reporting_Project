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
    <div className="flex flex-col min-h-screen text-center bg-gray-900 text-white font-poppins">
      {/* Logo et titre stylé en haut */}
      <header className="fixed top-0 left-0 p-4 w-full bg-gray-800 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Logo de l'entreprise"
            className="w-28 h-auto transition-transform duration-200 ease-in-out hover:scale-110"
          />
          {/* Titre stylé avec animation */}
          <h1 className="text-2xl font-bold text-indigo-400 tracking-wider shiny-title">A&C Process</h1>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow mt-16 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 animate-fadeIn">Reporting des plans</h1>
        {!planUrl ? (
          <PlanUploader onUpload={handleUpload} />
        ) : (
          <PlanViewer planUrl={planUrl} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 p-4 text-center w-full shadow-inner">
        &copy; 2024 A&C Process. Tous droits réservés.
      </footer>
    </div>
  );
}

export default App;
