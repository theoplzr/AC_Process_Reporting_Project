import React, { useState } from 'react';
import PlanUploader from './components/PlanUploader';
import PlanViewer from './components/PlanViewer';
import logo from './img/logo.png';

function App() {
  const [planUrl, setPlanUrl] = useState(null); // Stocker l'URL du plan uploadé
  const [mode, setMode] = useState(null); // Nouvel état pour stocker le mode sélectionné (Supervision ou Expertise)

  // Fonction appelée après l'upload du plan
  const handleUpload = (plan) => {
    setPlanUrl(plan.imagePath); // Sauvegarde l'URL de l'image uploadée
  };

  // Gestion de la sélection du mode (Supervision ou Expertise)
  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode); // Sauvegarder le mode sélectionné dans l'état
  };

  return (
    <div className="flex flex-col min-h-screen text-center bg-gray-900 text-white font-poppins">
      {/* Logo et titre en haut */}
      <header className="fixed top-0 left-0 p-4 w-full bg-gray-800 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Logo de l'entreprise"
            className="w-28 h-auto transition-transform duration-200 ease-in-out hover:scale-110"
          />
          <h1 className="text-2xl font-bold text-indigo-400 tracking-wider shiny-title">A&C Process</h1>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow mt-16 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 animate-fadeIn">Reporting des plans</h1>

        {/* Si le plan n'est pas encore uploadé, afficher PlanUploader */}
        {!planUrl && <PlanUploader onUpload={handleUpload} />}

        {/* Si le plan est uploadé mais que le mode n'est pas encore sélectionné */}
        {planUrl && !mode && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleModeSelection('Supervision')}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            >
              Supervision
            </button>
            <button
              onClick={() => handleModeSelection('Expertise')}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            >
              Expertise
            </button>
          </div>
        )}

        {/* Si le mode est sélectionné, afficher PlanViewer */}
        {planUrl && mode && (
          <PlanViewer planUrl={planUrl} mode={mode} />
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
