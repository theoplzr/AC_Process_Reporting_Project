// components/PlanViewer.js
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
    <div style={{ position: 'relative' }}>
      <img
        src={`http://localhost:3000/${planUrl}`}
        alt="Plan d'incinérateur"
        onClick={handleClick}
        style={{ width: '100%', cursor: 'pointer' }}
      />
      {points.map((point, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${point.x}px`,
            top: `${point.y}px`,
            width: '10px',
            height: '10px',
            backgroundColor: 'blue',
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite',
          }}
        />
      ))}
      {formVisible && (
        <FormPopup position={clickPosition} onSubmit={handleFormSubmit} />
      )}
    </div>
  );
};

export default PlanViewer;
