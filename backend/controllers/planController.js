const Plan = require('../models/Plan');
const FormData = require('../models/FormData');

// Upload d'un plan
exports.uploadPlan = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu' });
  }

  const imagePath = `uploads/${req.file.filename}`;  // Chemin relatif

  Plan.create({ imagePath })
    .then(plan => {
      res.status(201).json({ imagePath });  // Renvoie seulement le chemin relatif dans la réponse
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
};


// Sauvegarde des données du formulaire
exports.saveFormData = (req, res) => {
  const { xCoordinate, yCoordinate, response } = req.body;

  FormData.create({ xCoordinate, yCoordinate, response })
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
};
