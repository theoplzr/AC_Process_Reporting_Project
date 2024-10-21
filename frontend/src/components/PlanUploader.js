import React, { useState } from 'react';
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const PlanUploader = ({ onUpload }) => {
  // États pour gérer les différentes étapes du téléchargement de fichier
  const [selectedFile, setSelectedFile] = useState(null); // Fichier sélectionné par l'utilisateur
  const [isUploading, setIsUploading] = useState(false); // Indicateur de téléchargement en cours
  const [uploadSuccess, setUploadSuccess] = useState(false); // Indicateur de succès du téléchargement
  const [uploadError, setUploadError] = useState(''); // Gestion des messages d'erreur
  const [preview, setPreview] = useState(null); // Aperçu du fichier image sélectionné
  const [orientation, setOrientation] = useState(null); // Orientation de l'image (portrait ou paysage)

  // Fonction appelée lorsque l'utilisateur sélectionne un fichier
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Récupération du premier fichier sélectionné
    if (!file) {
      setUploadError('Aucun fichier sélectionné.'); // Message d'erreur si aucun fichier n'est sélectionné
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // Vérification de la taille maximale du fichier (5 Mo)
      setUploadError('Le fichier est trop volumineux. La taille maximale est de 5 Mo.');
      return;
    }
    setSelectedFile(file); // Stockage du fichier sélectionné
    setUploadSuccess(false); // Réinitialisation de l'état de succès
    setUploadError(''); // Réinitialisation des erreurs

    // Génération d'un aperçu du fichier sélectionné
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result; // Charge l'image dans une balise `<img>`
      img.onload = () => {
        const isLandscape = img.width > img.height; // Détection de l'orientation (paysage ou portrait)
        setOrientation(isLandscape ? 'landscape' : 'portrait'); // Mise à jour de l'orientation
        setPreview(e.target.result); // Stockage de l'aperçu
      };
    };
    reader.readAsDataURL(file); // Lecture du fichier sélectionné en tant qu'URL de données
  };

  // Gestion de la soumission du formulaire (téléchargement du fichier)
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadError('Veuillez sélectionner un fichier avant de continuer.');
      return;
    }
    setIsUploading(true); // Indicateur de téléchargement en cours

    const formData = new FormData();
    formData.append('plan', selectedFile); // Ajout du fichier à un objet FormData pour l'envoi

    try {
      // Envoi du fichier à l'API via une requête POST
      const response = await fetch('http://localhost:3307/api/plans/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        onUpload(result); // Appel de la fonction `onUpload` pour traiter la réponse du serveur
        setUploadSuccess(true); // Téléchargement réussi
        setUploadError(''); // Aucune erreur
      } else {
        setUploadError('Erreur lors du téléchargement. Veuillez réessayer.');
      }
    } catch (error) {
      setUploadError('Une erreur s\'est produite pendant le téléchargement.');
    } finally {
      setIsUploading(false); // Réinitialisation de l'état de téléchargement
    }
  };

  // Fonction pour réinitialiser la sélection et l'aperçu du fichier
  const resetUpload = () => {
    setSelectedFile(null); // Réinitialisation du fichier sélectionné
    setPreview(null); // Réinitialisation de l'aperçu
    setUploadSuccess(false); // Réinitialisation de l'état de succès
    setUploadError(''); // Réinitialisation des erreurs
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
              {/* Nom du fichier sélectionné ou message d'invitation */}
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
              src={preview} // Affichage de l'aperçu de l'image sélectionnée
              alt="Aperçu du fichier sélectionné"
              className={`w-full h-auto rounded-lg shadow ${orientation === 'landscape' ? 'max-h-[75vh]' : 'max-h-[75vh]'}`} // Appliquer une taille maximale pour l'aperçu
              style={{ objectFit: 'contain' }}
            />
            {/* Bouton pour changer l'image */}
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
                isUploading ? 'opacity-50 cursor-not-allowed' : '' // Désactiver le bouton si le téléchargement est en cours
              }`}
              disabled={isUploading}
              aria-label="Envoyer le fichier"
            >
              {isUploading ? (
                <span>Envoi en cours...</span> // Message affiché pendant l'envoi
              ) : uploadSuccess ? (
                <span className="flex items-center">
                  <FiCheckCircle className="mr-2" /> {selectedFile.name} envoyé avec succès
                </span> // Message de succès
              ) : (
                <span>Envoyer</span> // Bouton d'envoi par défaut
              )}
            </button>
          </div>
        )}

        {/* Gestion des erreurs et des messages de succès */}
        {uploadError && (
          <p className="text-red-400 text-sm mt-2 flex items-center">
            <FiAlertCircle className="mr-2" /> {uploadError} {/* Message d'erreur affiché */}
          </p>
        )}
        {uploadSuccess && (
          <p className="text-green-400 text-sm mt-2">
            Le fichier {selectedFile.name} a été téléchargé avec succès. {/* Message de succès */}
          </p>
        )}
      </form>

      {/* Espacement avant le footer */}
      <div className="mb-8"></div>
    </div>
  );
};

export default PlanUploader;
