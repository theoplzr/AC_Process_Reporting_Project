import React, { useState, useEffect, useRef } from 'react';
import { FiXCircle, FiSave, FiTrash2 } from 'react-icons/fi';

const FormPopup = ({ onSubmit, onDelete, onClose, existingData }) => {
  const [response, setResponse] = useState('');
  const [materials, setMaterials] = useState('');
  const [practices, setPractices] = useState('');
  const [anomalies, setAnomalies] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [severity, setSeverity] = useState('green');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    if (existingData) {
      setResponse(existingData.response || '');
      setMaterials(existingData.materials || '');
      setPractices(existingData.practices || '');
      setAnomalies(existingData.anomalies || '');
      setMaintenance(existingData.maintenance || '');
      setSeverity(existingData.severity || 'green');

      if (existingData.photos) {
        const initialPreviews = existingData.photos.map(photo =>
          typeof photo === 'string' ? photo : URL.createObjectURL(photo)
        );
        setPhotos(existingData.photos);
        setPreviews(initialPreviews);
      }
    }
  }, [existingData]);

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const isLandscape = img.width > img.height;
          const imagePreview = {
            src: e.target.result,
            orientation: isLandscape ? 'landscape' : 'portrait',
          };
          setPhotos((prevPhotos) => [...prevPhotos, file]);
          setPreviews((prevPreviews) => [...prevPreviews, imagePreview]);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = [...photos];
    const newPreviews = [...previews];

    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);

    setPhotos(newPhotos);
    setPreviews(newPreviews);
  };

  const handleCloseForm = () => {
    if (!response || !materials || !practices || !anomalies || !maintenance) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    onSubmit({ response, materials, practices, anomalies, maintenance, severity, photos });
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!response || !materials || !practices || !anomalies || !maintenance) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    onSubmit({ response, materials, practices, anomalies, maintenance, severity, photos });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: '100%',
        maxWidth: '600px',
      }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 w-full animate-fadeIn"
    >
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-xl">
        <h2 className="text-lg font-bold text-gray-700 tracking-wider">Supervision</h2>
        <button
          onClick={handleCloseForm}
          className="text-gray-500 hover:text-gray-700 transition-colors hover:animate-pulse"
        >
          <FiXCircle size={24} />
        </button>
      </div>

      {/* Form Content */}
      <div ref={formRef} className="overflow-auto p-6" style={{ maxHeight: '80vh' }}>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

          {/* Supervision Fields */}
          <div>
            <label className="font-semibold text-gray-700 tracking-wider">Étapes de reconstruction/réparation :</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              rows="4"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 tracking-wider">Matériaux mis en œuvre :</label>
            <textarea
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              rows="3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 tracking-wider">Bonnes pratiques observées :</label>
            <textarea
              value={practices}
              onChange={(e) => setPractices(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              rows="3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 tracking-wider">Anomalies et réserves :</label>
            <textarea
              value={anomalies}
              onChange={(e) => setAnomalies(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              rows="3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 tracking-wider">Plan de maintenance :</label>
            <textarea
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              rows="3"
            />
          </div>

          {/* Severity Color Selector */}
          <div>
            <label className="font-semibold text-gray-700 tracking-wider">Gravité de la supervision :</label>
            <div className="flex items-center space-x-2">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="red">Non-conformité majeure</option>
                <option value="orange">Non-conformité mineure</option>
                <option value="lightgreen">Améliorable</option>
                <option value="green">Conforme</option>
              </select>
              <div
                className={`w-6 h-6 rounded-full ${severity === 'red' ? 'bg-red-600' : severity === 'orange' ? 'bg-orange-500' : severity === 'lightgreen' ? 'bg-green-300' : 'bg-green-600'}`}
              ></div>
            </div>
          </div>

          {/* Photos Upload */}
          <div>
            <label className="font-semibold text-gray-700 tracking-wider">Photos :</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Photo Previews */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview.src}
                    alt={`Preview ${index}`}
                    className={`w-full h-auto rounded-lg shadow ${preview.orientation === 'landscape' ? 'max-w-full' : 'max-h-60'}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform transform hover:scale-110 hover:animate-pulse"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form Buttons */}
          <div className="flex justify-between mt-6 space-x-4">
            <button
              type="submit"
              className="flex items-center justify-center bg-green-500 text-white py-2 px-6 rounded-lg shadow hover:bg-green-600 transition-transform transform hover:scale-105 hover:animate-pulse"
            >
              <FiSave className="mr-2" /> Sauvegarder
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="flex items-center justify-center bg-red-500 text-white py-2 px-6 rounded-lg shadow hover:bg-red-600 transition-transform transform hover:scale-105 hover:animate-pulse"
            >
              <FiTrash2 className="mr-2" /> Supprimer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPopup;
