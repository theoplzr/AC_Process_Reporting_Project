import React, { useState, useEffect } from 'react';
import FormPopup from './FormPopup';

const PlanViewer = ({ planUrl }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [points, setPoints] = useState([]);
  const [editingPoint, setEditingPoint] = useState(null); // Point actuellement modifié

  // Fonction pour sauvegarder les points dans le Local Storage
  const savePointsToLocalStorage = (points) => {
    localStorage.setItem('savedPoints', JSON.stringify(points));
  };

  // Récupération des points depuis le Local Storage lors du chargement du composant
  useEffect(() => {
    const storedPoints = localStorage.getItem('savedPoints');
    if (storedPoints) {
      setPoints(JSON.parse(storedPoints));
    }
  }, []);

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickPosition({ x, y });
    setFormVisible(true);
    setEditingPoint(null); // Réinitialiser la modification
  };

  const handleFormSubmit = (data) => {
    let updatedPoints;
    if (editingPoint !== null) {
      // Si nous éditons un point, mettons à jour le point
      updatedPoints = points.map((point, index) =>
        index === editingPoint ? { ...point, data } : point
      );
    } else {
      // Sinon, ajoutons un nouveau point
      updatedPoints = [...points, { x: clickPosition.x, y: clickPosition.y, data }];
    }
    setPoints(updatedPoints);
    setFormVisible(false);
    savePointsToLocalStorage(updatedPoints); // Sauvegarde dans le Local Storage
  };

  const handleDeletePoint = () => {
    if (editingPoint !== null) {
      const updatedPoints = points.filter((_, index) => index !== editingPoint);
      setPoints(updatedPoints);
      setFormVisible(false); // Fermer le formulaire
      savePointsToLocalStorage(updatedPoints); // Sauvegarde dans le Local Storage
    }
  };

  const handlePointClick = (index) => {
    setClickPosition({ x: points[index].x, y: points[index].y });
    setFormVisible(true);
    setEditingPoint(index); // Référence au point en cours de modification
  };

  return (
    <div className="relative bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      <img
        src={`http://localhost:3307/${planUrl}`}
        alt="Plan d'incinérateur"
        onClick={handleClick}
        className="w-full rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity duration-300"
      />
      {points.map((point, index) => (
        <div
          key={index}
          className="absolute bg-blue-500 rounded-full w-4 h-4 animate-pulse shadow-lg cursor-pointer"
          style={{ left: `${point.x}px`, top: `${point.y}px` }}
          onClick={() => handlePointClick(index)} // Revenir au formulaire sur clic
        />
      ))}
      {formVisible && (
        <FormPopup
          position={clickPosition}
          onSubmit={handleFormSubmit}
          onDelete={handleDeletePoint} // Supprimer un point
          existingData={editingPoint !== null ? points[editingPoint].data : null} // Pré-remplir avec les données
        />
      )}
    </div>
  );
};

export default PlanViewer;
