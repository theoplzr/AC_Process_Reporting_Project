import React, { useState, useEffect } from 'react';
import { FiXCircle, FiSave, FiTrash2 } from 'react-icons/fi';

const FormPopup = ({ onSubmit, onDelete, onClose, existingData, mode, planImage }) => {
  // Champs partagés
  const [zoneName, setZoneName] = useState('');
  const [severity, setSeverity] = useState('green');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [photoDescriptions, setPhotoDescriptions] = useState([]);

  // Champs Supervision
  const [materials, setMaterials] = useState([{ material: '', thickness: '' }]);
  const [generalAppreciation, setGeneralAppreciation] = useState('');
  const [stepDone, setStepDone] = useState('');
  const [workPlanning, setWorkPlanning] = useState('');
  const [improvements, setImprovements] = useState('');
  const [reserve, setReserve] = useState('');

  // Champs Expertise
  const [expertiseMaterials, setExpertiseMaterials] = useState([{ material: '', thickness: '' }]); // Matériaux pour Expertise
  const [age, setAge] = useState('');
  const [damageNature, setDamageNature] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [probableCause, setProbableCause] = useState('');
  const [potentialOrigins, setPotentialOrigins] = useState('');
  const [immediateRecommendations, setImmediateRecommendations] = useState('');
  const [longTermRecommendations, setLongTermRecommendations] = useState('');

  useEffect(() => {
    if (existingData) {
      setZoneName(existingData.zoneName || '');
      setSeverity(existingData.severity || 'green');
      setPhotos(existingData.photos || []);
      setPhotoDescriptions(existingData.photoDescriptions || []);

      // Champs Supervision
      setMaterials(existingData.materials || [{ material: '', thickness: '' }]);
      setGeneralAppreciation(existingData.generalAppreciation || '');
      setStepDone(existingData.stepDone || '');
      setWorkPlanning(existingData.workPlanning || '');
      setImprovements(existingData.improvements || '');
      setReserve(existingData.reserve || '');

      // Champs Expertise
      setExpertiseMaterials(existingData.expertiseMaterials || [{ material: '', thickness: '' }]);
      setAge(existingData.age || '');
      setDamageNature(existingData.damageNature || '');
      setDamageDescription(existingData.damageDescription || '');
      setProbableCause(existingData.probableCause || '');
      setPotentialOrigins(existingData.potentialOrigins || '');
      setImmediateRecommendations(existingData.immediateRecommendations || '');
      setLongTermRecommendations(existingData.longTermRecommendations || '');
    }
  }, [existingData]);

  // Gestion des photos
  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = [...photos];
    const newPreviews = [...previews];
    const newDescriptions = [...photoDescriptions];
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    newDescriptions.splice(index, 1);
    setPhotos(newPhotos);
    setPreviews(newPreviews);
    setPhotoDescriptions(newDescriptions);
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...photoDescriptions];
    newDescriptions[index] = value;
    setPhotoDescriptions(newDescriptions);
  };

  // Ajouter une nouvelle ligne au tableau matériaux/épaisseur
  const addMaterialRow = (isExpertise) => {
    if (isExpertise) {
      setExpertiseMaterials([...expertiseMaterials, { material: '', thickness: '' }]);
    } else {
      setMaterials([...materials, { material: '', thickness: '' }]);
    }
  };

  // Supprimer une ligne du tableau matériaux/épaisseur
  const removeMaterialRow = (index, isExpertise) => {
    if (isExpertise) {
      const newExpertiseMaterials = [...expertiseMaterials];
      newExpertiseMaterials.splice(index, 1);
      setExpertiseMaterials(newExpertiseMaterials);
    } else {
      const newMaterials = [...materials];
      newMaterials.splice(index, 1);
      setMaterials(newMaterials);
    }
  };

  // Gérer la modification du tableau matériaux/épaisseur
  const handleMaterialChange = (index, field, value, isExpertise) => {
    if (isExpertise) {
      const newMaterials = [...expertiseMaterials];
      newMaterials[index][field] = value;
      setExpertiseMaterials(newMaterials);
    } else {
      const newMaterials = [...materials];
      newMaterials[index][field] = value;
      setMaterials(newMaterials);
    }
  };

  // Soumettre le formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = mode === 'Supervision'
      ? { zoneName, materials, generalAppreciation, stepDone, workPlanning, improvements, reserve, severity, photos, photoDescriptions }
      : { zoneName, age, expertiseMaterials, damageNature, damageDescription, probableCause, potentialOrigins, immediateRecommendations, longTermRecommendations, severity, photos, photoDescriptions };
    
    onSubmit(data);
    onClose();
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
      {/* En-tête */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-xl">
        <h2 className="text-lg font-bold text-gray-700 tracking-wider">{mode === 'Supervision' ? 'Formulaire de Supervision' : 'Formulaire d\'Expertise'}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors hover:animate-pulse"
        >
          <FiXCircle size={24} />
        </button>
      </div>

      {/* Contenu du formulaire */}
      <div className="overflow-auto p-6" style={{ maxHeight: '80vh' }}>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

          {/* Nom de la zone */}
          <div>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="Entrer le nom de la zone avec l'orientation (avant, arrière, …)"
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* Réduction du plan + point (image) */}
          <div>
            <img
              src={planImage}
              alt="Plan"
              className="w-full mt-2 rounded-lg shadow"
            />
          </div>

          {/* Formulaire dynamique basé sur le mode */}
          {mode === 'Supervision' ? (
            <>
              {/* Matériaux en place / ajoutés (Tableau) */}
              <div>
                <label className="font-semibold text-gray-700">Matériaux en place / ajoutés :</label>
                <table className="w-full mt-2 border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">Matériau</th>
                      <th className="border border-gray-300 p-2">Épaisseur</th>
                      <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((material, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            value={material.material}
                            onChange={(e) => handleMaterialChange(index, 'material', e.target.value, false)}
                            placeholder="Matériau"
                            className="p-2 border border-gray-300 w-full text-gray-800"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            value={material.thickness}
                            onChange={(e) => handleMaterialChange(index, 'thickness', e.target.value, false)}
                            placeholder="Épaisseur"
                            className="p-2 border border-gray-300 w-full text-gray-800"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <button
                            type="button"
                            onClick={() => removeMaterialRow(index, false)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={() => addMaterialRow(false)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Ajouter une ligne
                </button>
              </div>

              {/* Appreciation générale */}
              <div>
                <textarea
                  value={generalAppreciation}
                  onChange={(e) => setGeneralAppreciation(e.target.value)}
                  placeholder="Appréciation générale"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Étape réalisée */}
              <div>
                <input
                  type="text"
                  value={stepDone}
                  onChange={(e) => setStepDone(e.target.value)}
                  placeholder="Intitulé de l'étape"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Planification de travaux */}
              <div>
                <textarea
                  value={workPlanning}
                  onChange={(e) => setWorkPlanning(e.target.value)}
                  placeholder="Proposition de planification de travaux"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Points d'améliorations */}
              <div>
                <textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="Préconisations et optimisations potentielles"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Réserve */}
              <div>
                <textarea
                  value={reserve}
                  onChange={(e) => setReserve(e.target.value)}
                  placeholder="Renseigner la durée de réserve le cas échéant"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>
            </>
          ) : (
            <>
              {/* Tableau Matériaux Expertise */}
              <div>
                <label className="font-semibold text-gray-700">Matériaux initiaux :</label>
                <table className="w-full mt-2 border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">Matériau</th>
                      <th className="border border-gray-300 p-2">Épaisseur</th>
                      <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expertiseMaterials.map((material, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            value={material.material}
                            onChange={(e) => handleMaterialChange(index, 'material', e.target.value, true)}
                            placeholder="Matériau"
                            className="p-2 border border-gray-300 w-full text-gray-800"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            value={material.thickness}
                            onChange={(e) => handleMaterialChange(index, 'thickness', e.target.value, true)}
                            placeholder="Épaisseur"
                            className="p-2 border border-gray-300 w-full text-gray-800"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <button
                            type="button"
                            onClick={() => removeMaterialRow(index, true)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={() => addMaterialRow(true)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Ajouter une ligne
                </button>
              </div>

              {/* Âge */}
              <div>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Si connue, durée depuis la dernière réparation/reconstruction"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Nature de l'endommagement */}
              <div>
                <textarea
                  value={damageNature}
                  onChange={(e) => setDamageNature(e.target.value)}
                  placeholder="Que dit l'inspection visuelle ? (usure, fissuration, perte d'épaisseur, absence, ...)"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Description de l'endommagement */}
              <div>
                <textarea
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                  placeholder="Quelques mots sur l'étendu et la description de l'endommagement"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Cause probable */}
              <div>
                <textarea
                  value={probableCause}
                  onChange={(e) => setProbableCause(e.target.value)}
                  placeholder="Préciser la cause si identifiée (méca, chimie, thermo-méca)"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Origines potentielles */}
              <div>
                <textarea
                  value={potentialOrigins}
                  onChange={(e) => setPotentialOrigins(e.target.value)}
                  placeholder="Préciser les origines potentielles (matériau, montage, exploitation, …)"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Préconisations immédiates */}
              <div>
                <textarea
                  value={immediateRecommendations}
                  onChange={(e) => setImmediateRecommendations(e.target.value)}
                  placeholder="Préconisations faites sur place"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Préconisations long terme */}
              <div>
                <textarea
                  value={longTermRecommendations}
                  onChange={(e) => setLongTermRecommendations(e.target.value)}
                  placeholder="Moyens de réduction/suppression à plus long terme"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                />
              </div>
            </>
          )}

          {/* Gravité */}
          <div>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full text-gray-800"
            >
              <option value="green">Conforme (Vert)</option>
              <option value="yellow">Améliorable (Jaune)</option> {/* Vrai jaune */}
              <option value="orange">Non-conformité mineure (Orange)</option>
              <option value="red">Non-conformité majeure (Rouge)</option>
            </select>
          </div>

          {/* Ajout de photos */}
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-gray-800"
            />
          </div>

          {/* Prévisualisation des photos */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-auto rounded-lg shadow"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform transform hover:scale-110"
                  >
                    <FiTrash2 size={20} />
                  </button>
                  <input
                    type="text"
                    value={photoDescriptions[index] || ''}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    placeholder="Description de la photo"
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-gray-800 placeholder-gray-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Boutons d'action */}
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
