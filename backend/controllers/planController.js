const Plan = require('../models/Plan');  // Importer le modèle Plan
const FormData = require('../models/FormData');  // Importer le modèle FormData

// Fonction pour gérer l'upload d'un plan
exports.uploadPlan = (req, res) => {
  // Vérifier si un fichier a été envoyé
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu' });  // Si aucun fichier, renvoyer une erreur 400
  }

  const imagePath = `uploads/${req.file.filename}`;  // Construire le chemin relatif de l'image

  // Créer une nouvelle entrée dans la table Plan avec le chemin de l'image
  Plan.create({ imagePath })
    .then(plan => {
      res.status(201).json({ imagePath });  // Réponse avec le chemin de l'image en cas de succès
    })
    .catch(error => {
      res.status(400).json({ error: error.message });  // Renvoyer une erreur 400 si la création échoue
    });
};

// Fonction pour sauvegarder les données du formulaire
exports.saveFormData = (req, res) => {
  const { xCoordinate, yCoordinate, response } = req.body;  // Extraire les données du corps de la requête

  // Créer une nouvelle entrée dans la table FormData avec les données du formulaire
  FormData.create({ xCoordinate, yCoordinate, response })
    .then(data => {
      res.status(201).json(data);  // Réponse avec les données créées en cas de succès
    })
    .catch(error => {
      res.status(400).json({ error: error.message });  // Renvoyer une erreur 400 si la création échoue
    });
};
