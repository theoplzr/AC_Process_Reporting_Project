import React, { useState } from 'react';
import FormPopup from './FormPopup';
import { FiRefreshCw } from 'react-icons/fi';

const PlanViewer = ({ planUrl, mode }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [points, setPoints] = useState([]);
  const [editingPoint, setEditingPoint] = useState(null);

  // Handle clicking on image to add a new point
  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickPosition({ x, y });
    setFormVisible(true);
    setEditingPoint(null);
  };

  // Handle form submission for the point data
  const handleFormSubmit = (data) => {
    const updatedPoints = editingPoint !== null 
      ? points.map((point, index) =>
          index === editingPoint ? { ...point, data } : point
        )
      : [...points, { x: clickPosition.x, y: clickPosition.y, data, index: points.length + 1 }];

    setPoints(updatedPoints);
    setFormVisible(false);
  };

  // Handle deleting a point
  const handleDeletePoint = () => {
    if (editingPoint !== null) {
      const updatedPoints = points.filter((_, index) => index !== editingPoint);
      setPoints(updatedPoints);
      setFormVisible(false);
    }
  };

  // Handle clicking on a point to edit it
  const handlePointClick = (index) => {
    setClickPosition({ x: points[index].x, y: points[index].y });
    setFormVisible(true);
    setEditingPoint(index);
  };

  // Reset all points
  const resetPoints = () => {
    setPoints([]);
  };

  // Define color of points based on severity
  const getColorFromSeverity = (severity) => {
    switch (severity) {
      case 'red':
        return 'bg-red-600';
      case 'orange':
        return 'bg-orange-500';
      case 'yellow':
        return 'bg-yellow-400';
      case 'green':
        return 'bg-green-600';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen p-6">
      {/* Button to reset all points */}
      <div className="flex justify-end w-full max-w-4xl">
        <button
          onClick={resetPoints}
          className="flex items-center text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg shadow-md transition transform hover:scale-105 mb-4"
        >
          <FiRefreshCw className="mr-2" /> Réinitialiser les points
        </button>
      </div>

      {/* Image container */}
      <div className="relative w-full max-w-4xl">
        <img
          src={`http://localhost:3307/${planUrl}`}  // URL of the uploaded plan
          alt="Plan"
          onClick={handleClick}
          className="w-full h-auto rounded-lg cursor-crosshair shadow-xl"
        />
        {points.map((point, index) => (
          <div
            key={index}
            className={`absolute rounded-full w-8 h-8 flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transition-transform duration-300 hover:scale-125 ${getColorFromSeverity(point.data.severity)}`}
            style={{ left: `${point.x}px`, top: `${point.y}px` }}
            onClick={() => handlePointClick(index)}
          >
            {point.index} {/* Display the point number */}
          </div>
        ))}

        {formVisible && (
          <div className="transition-opacity duration-300 opacity-100">
            <FormPopup
              position={clickPosition}
              onSubmit={handleFormSubmit}
              onDelete={handleDeletePoint}
              onClose={() => setFormVisible(false)}
              existingData={editingPoint !== null ? points[editingPoint].data : null}
              mode={mode}  // Pass the selected mode to show the correct form
            />
          </div>
        )}
      </div>

      {/* Display message if no points are added */}
      {!points.length && (
        <p className="text-white text-sm mt-4 animate-pulse">
          Cliquez sur l'image pour ajouter un point.
        </p>
      )}
    </div>
  );
};

export default PlanViewer;
