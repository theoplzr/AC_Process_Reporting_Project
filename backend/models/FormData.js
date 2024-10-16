const { DataTypes } = require('sequelize');  // Importer DataTypes depuis Sequelize pour définir les types de colonnes
const sequelize = require('../config/db');  // Importer la connexion à la base de données Sequelize

// Définir le modèle 'FormData' avec les colonnes nécessaires
const FormData = sequelize.define('FormData', {
  xCoordinate: {
    type: DataTypes.INTEGER,  // Champ pour les coordonnées X, type entier
    allowNull: false  // Ce champ est obligatoire (ne peut pas être nul)
  },
  yCoordinate: {
    type: DataTypes.INTEGER,  // Champ pour les coordonnées Y, type entier
    allowNull: false  // Ce champ est également obligatoire
  },
  response: {
    type: DataTypes.TEXT,  // Champ pour stocker une réponse, de type texte
    allowNull: false  // Ce champ est obligatoire
  }
});

module.exports = FormData;  // Exporter le modèle pour l'utiliser ailleurs dans l'application
