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
        position: 'absolute', // Position absolue pour ne pas affecter les autres éléments
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000, // S'assurer que le formulaire est au-dessus de tout
      }}
      className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <label className="font-semibold">Réponse :</label>
        <input
          type="text"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
        >
          Soumettre
        </button>
      </form>
    </div>
  );
};

export default FormPopup;
