const { DataTypes } = require('sequelize');  // Importer DataTypes depuis Sequelize pour définir les types de colonnes
const sequelize = require('../config/db');  // Importer la connexion à la base de données Sequelize

// Définir le modèle 'Plan' avec la colonne nécessaire
const Plan = sequelize.define('Plan', {
  imagePath: {
    type: DataTypes.STRING,  // Champ pour stocker le chemin de l'image, type chaîne de caractères
    allowNull: false  // Ce champ est obligatoire (ne peut pas être nul)
  }
});

module.exports = Plan;  // Exporter le modèle pour l'utiliser dans d'autres parties de l'application
