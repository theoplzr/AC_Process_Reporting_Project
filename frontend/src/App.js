import React, { useState } from 'react';
import PlanUploader from './components/PlanUploader';
import PlanViewer from './components/PlanViewer';
import logo from './img/logo.png';

function App() {
  const [planUrl, setPlanUrl] = useState(null); // Store the uploaded plan's URL
  const [mode, setMode] = useState(null); // Store selected mode (Supervision or Expertise)

  // Function called after the plan is uploaded
  const handleUpload = (plan) => {
    setPlanUrl(plan.imagePath); // Save the uploaded image's URL
  };

  // Handle mode selection (Supervision or Expertise)
  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode); // Save selected mode in the state
  };

  // Handle data submission from PlanViewer (simulate the form submission)
  const handleFormSubmit = (data) => {
    // Placeholder function for handling form data
    console.log(data);
  };

  return (
    <div className="flex flex-col min-h-screen text-center bg-gray-900 text-white font-poppins">
      {/* Header */}
      <header className="fixed top-0 left-0 p-4 w-full bg-gray-800 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Company logo"
            className="w-28 h-auto transition-transform duration-200 ease-in-out hover:scale-110"
          />
          <h1 className="text-2xl font-bold text-indigo-400 tracking-wider shiny-title">A&C Process</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow mt-16 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 animate-fadeIn">Plan Reporting</h1>

        {/* If plan is not yet uploaded, show the uploader */}
        {!planUrl && <PlanUploader onUpload={handleUpload} />}

        {/* If the plan is uploaded but mode not yet selected */}
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

        {/* If mode is selected, show PlanViewer and collect data */}
        {planUrl && mode && (
          <PlanViewer
            planUrl={planUrl}
            mode={mode}
            onFormSubmit={handleFormSubmit} // Capture the data from PlanViewer
          />
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
