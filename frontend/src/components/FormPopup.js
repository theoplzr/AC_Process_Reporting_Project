import React, { useState, useEffect } from 'react';

const FormPopup = ({ position, onSubmit, onDelete, existingData }) => {
  const [response, setResponse] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (existingData) {
      setResponse(existingData.response || '');
      if (existingData.photo) {
        setPhoto(existingData.photo);
        setPreview(existingData.photo);
      }
    }
  }, [existingData]);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
    setPreview(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ response, photo });
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x + 150}px`, // Déplacer le formulaire plus loin de l'image pour garantir la visibilité
        top: `${position.y}px`,
        zIndex: 1000,
      }}
      className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="font-semibold text-gray-700">Réponse :</label>
        <input
          type="text"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        
        <label className="font-semibold text-gray-700">Photo :</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        
        {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="Prévisualisation"
              className="w-full h-auto rounded shadow"
            />
            <button
              type="button"
              onClick={handleDeletePhoto}
              className="mt-2 bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 transition"
            >
              Supprimer la photo
            </button>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
          >
            Soumettre
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 transition"
          >
            Supprimer
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPopup;
