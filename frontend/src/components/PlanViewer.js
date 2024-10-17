import React, { useState, useRef, useEffect } from 'react';
import FormPopup from './FormPopup';
import { FiRefreshCw } from 'react-icons/fi'; // Icone pour réinitialiser les points
import GeneratePDFButton from './GeneratePDFButton'; // Ajout du bouton de génération PDF

const PlanViewer = ({ planUrl }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [points, setPoints] = useState([]);
  const [editingPoint, setEditingPoint] = useState(null);
  const canvasRef = useRef();  // Référence pour le canvas

  // Gérer le clic sur l'image pour ajouter un nouveau point
  const handleClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect(); // Utiliser le canvas
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickPosition({ x, y });
    setFormVisible(true);
    setEditingPoint(null); // Désactiver l'édition lors de l'ajout d'un nouveau point
  };

  // Dessiner le plan et les points sur le canvas après son rendu
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
  
    // Activer CORS pour l'image
    img.crossOrigin = "anonymous";
  
    img.src = `http://localhost:3307/${planUrl}`;
    img.onload = () => {
      // Redimensionner le canvas en fonction de l'image
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0); // Dessiner l'image du plan sur le canvas
  
      // Dessiner les points sur le canvas
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI); // Cercle pour le point
        ctx.fillStyle = getColorFromSeverity(point.data.severity);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(point.index, point.x - 5, point.y + 5); // Numéro du point
        ctx.closePath();
      });
    };
  }, [points, planUrl]);// Redessiner à chaque changement des points ou de l'image

  // Soumission des données du formulaire de point
  const handleFormSubmit = (data) => {
    const updatedPoints = editingPoint !== null 
      ? points.map((point, index) =>
          index === editingPoint ? { ...point, data } : point
        )
      : [...points, { x: clickPosition.x, y: clickPosition.y, data, index: points.length + 1 }];
    
    setPoints(updatedPoints);
    setFormVisible(false);
  };

  // Suppression d'un point
  const handleDeletePoint = () => {
    if (editingPoint !== null) {
      const updatedPoints = points.filter((_, index) => index !== editingPoint);
      setPoints(updatedPoints);
      setFormVisible(false);
    }
  };

  // Gestion du clic sur un point pour l'éditer
  const handlePointClick = (index) => {
    setClickPosition({ x: points[index].x, y: points[index].y });
    setFormVisible(true);
    setEditingPoint(index); // Activer le mode édition lors du clic sur un point existant
  };

  // Réinitialisation des points
  const resetPoints = () => {
    setPoints([]); // Réinitialiser tous les points
  };

  // Définir la couleur du point selon la gravité
  const getColorFromSeverity = (severity) => {
    switch (severity) {
      case 'red':
        return 'red';
      case 'orange':
        return 'orange';
      case 'lightgreen':
        return 'lightgreen';
      case 'green':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen p-6">
      {/* Bouton pour réinitialiser les points */}
      <div className="flex justify-end w-full max-w-4xl">
        <button
          onClick={resetPoints}
          className="flex items-center text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg shadow-md transition transform hover:scale-105 mb-4"
        >
          <FiRefreshCw className="mr-2" /> Réinitialiser les points
        </button>
      </div>

      {/* Canvas */}
      <div className="relative w-full max-w-4xl">
        <canvas
          ref={canvasRef}  // Utilisation du canvas
          onClick={handleClick}
          className="w-auto h-auto max-w-full rounded-lg cursor-crosshair shadow-xl"
          style={{ objectFit: 'contain' }}  // Contenir l'image sans distorsion
        />
        {formVisible && (
          <div className="transition-opacity duration-300 opacity-100">
            <FormPopup
              position={clickPosition}
              onSubmit={handleFormSubmit}
              onDelete={handleDeletePoint}
              onClose={() => setFormVisible(false)}
              existingData={editingPoint !== null ? points[editingPoint].data : null}
            />
          </div>
        )}

        {/* Bouton pour générer le rapport PDF */}
        <GeneratePDFButton points={points} canvasRef={canvasRef} />
      </div>

      {/* Message d'information si aucun point n'est ajouté */}
      {!points.length && (
        <p className="text-white text-sm mt-4 animate-pulse">
          Cliquez sur l'image pour ajouter un point.
        </p>
      )}
    </div>
  );
};

export default PlanViewer;
