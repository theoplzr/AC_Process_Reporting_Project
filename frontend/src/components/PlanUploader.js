// components/PlanUploader.js
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
      const response = await fetch('http://localhost:3000/api/plans/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        onUpload(result); // Retourner l'URL du plan au composant parent
      } else {
        console.error('Erreur lors du téléchargement du plan', result);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload du plan :', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit">Charger le plan</button>
    </form>
  );
};

export default PlanUploader;
