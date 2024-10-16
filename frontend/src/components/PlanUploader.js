import React, { useState } from 'react';

const PlanUploader = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    const formData = new FormData();
    formData.append('plan', selectedFile);

    try {
      const response = await fetch('http://localhost:3307/api/plans/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        onUpload(result);
      } else {
        console.error('Erreur lors du téléchargement du plan', result);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload du plan :', error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col items-center bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200 p-8 rounded-lg shadow-xl space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-700 uppercase tracking-wide hover:text-indigo-700 transition-colors">
        Télécharger un plan
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500 transition"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transform transition-transform duration-300 hover:scale-105"
      >
        Charger le plan
      </button>
    </form>
  );
};

export default PlanUploader;
