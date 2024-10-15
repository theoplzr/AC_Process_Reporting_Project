import React, { useState } from 'react';
import FormPopup from './FormPopup';

const PlanViewer = ({ planUrl }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [points, setPoints] = useState([]);

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickPosition({ x, y });
    setFormVisible(true);
  };

  const handleFormSubmit = (data) => {
    setPoints([...points, { ...clickPosition, data }]);
    setFormVisible(false);
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
          className="absolute bg-blue-500 rounded-full w-4 h-4 animate-pulse shadow-lg"
          style={{ left: `${point.x}px`, top: `${point.y}px` }}
        />
      ))}
      {formVisible && (
        <FormPopup position={clickPosition} onSubmit={handleFormSubmit} />
      )}
    </div>
  );
};

export default PlanViewer;
