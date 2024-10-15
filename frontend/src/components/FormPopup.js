// components/FormPopup.js
import React, { useState } from 'react';

const FormPopup = ({ position, onSubmit }) => {
  const [response, setResponse] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ response });
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid black',
        zIndex: 1000,
      }}
    >
      <form onSubmit={handleSubmit}>
        <label>
          Réponse :
          <input
            type="text"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        </label>
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default FormPopup;
