import React, { useState } from 'react';
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const PlanUploader = ({ onUpload }) => {
  // États pour la gestion des fichiers et du statut de téléchargement
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [preview, setPreview] = useState(null); 
  const [orientation, setOrientation] = useState(null); 

  // Gestion de la sélection d'un fichier
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setUploadError('Aucun fichier sélectionné.');
      return;
    }

    // Limite de taille du fichier (5 Mo)
    if (file.size > 5 * 1024 * 1024) { 
      setUploadError('Le fichier est trop volumineux. La taille maximale est de 5 Mo.');
      return;
    }

    setSelectedFile(file);
    setUploadSuccess(false);
    setUploadError('');

    // Création de l'aperçu du fichier sélectionné
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const isLandscape = img.width > img.height;
        setOrientation(isLandscape ? 'landscape' : 'portrait');
        setPreview(e.target.result); 
      };
    };
    reader.readAsDataURL(file);
  };

  // Envoi du fichier sélectionné au serveur
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadError('Veuillez sélectionner un fichier avant de continuer.');
      return;
    }
    setIsUploading(true);

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
        setUploadSuccess(true);
        setUploadError('');
      } else {
        setUploadError('Erreur lors du téléchargement. Veuillez réessayer.');
      }
    } catch (error) {
      setUploadError('Une erreur s\'est produite pendant le téléchargement.');
    } finally {
      setIsUploading(false);
    }
  };

  // Réinitialisation de l'état de l'upload
  const resetUpload = () => {
    setSelectedFile(null); 
    setPreview(null); 
    setUploadSuccess(false); 
    setUploadError(''); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center bg-gray-800 p-8 rounded-xl shadow-lg space-y-6 w-full max-w-3xl mb-16"
      >
        {/* Zone de sélection de fichier */}
        <div className="w-full">
          <label className="block w-full">
            <div className="flex flex-col items-center justify-center w-full px-6 py-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm cursor-pointer text-gray-300 hover:border-indigo-500 transition relative hover:bg-indigo-500 group">
              <FiUploadCloud size={48} className="text-indigo-400 mb-4 group-hover:animate-pulse" />
              <span className="text-base font-medium tracking-wider">
                {selectedFile ? selectedFile.name : 'Sélectionnez un fichier (image ou PDF)'}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Charger un fichier"
              />
            </div>
          </label>
        </div>

        {/* Aperçu du fichier sélectionné et bouton de changement */}
        {preview && (
          <div className="w-full flex flex-col items-center mt-4 space-y-4">
            <img
              src={preview}
              alt="Aperçu du fichier sélectionné"
              className={`w-full h-auto rounded-lg shadow ${orientation === 'landscape' ? 'max-h-[75vh]' : 'max-h-[75vh]'}`}
              style={{ objectFit: 'contain' }}
            />

            <button
              type="button"
              onClick={resetUpload}
              className="flex items-center justify-center bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-transform duration-300 hover:scale-105 focus:outline-none"
              aria-label="Changer l'image"
            >
              <FiRefreshCw className="mr-2" /> Changer d'image
            </button>

            {/* Bouton d'envoi */}
            <button
              type="submit"
              className={`flex items-center justify-center bg-indigo-600 text-white py-3 px-8 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 relative ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isUploading}
              aria-label="Envoyer le fichier"
            >
              {isUploading ? (
                <span>Envoi en cours...</span>
              ) : uploadSuccess ? (
                <span className="flex items-center">
                  <FiCheckCircle className="mr-2" /> {selectedFile.name} envoyé avec succès
                </span>
              ) : (
                <span>Envoyer</span>
              )}
            </button>
          </div>
        )}

        {/* Gestion des erreurs et des messages de succès */}
        {uploadError && (
          <p className="text-red-400 text-sm mt-2 flex items-center">
            <FiAlertCircle className="mr-2" /> {uploadError}
          </p>
        )}
        {uploadSuccess && (
          <p className="text-green-400 text-sm mt-2">
            Le fichier {selectedFile.name} a été téléchargé avec succès.
          </p>
        )}
      </form>

      {/* Espacement avant le footer */}
      <div className="mb-8"></div>
    </div>
  );
};

export default PlanUploader;
