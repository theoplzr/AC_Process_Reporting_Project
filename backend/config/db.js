const { Sequelize } = require('sequelize');  // Importer Sequelize pour gérer les connexions à la base de données

// Créer une instance de Sequelize pour se connecter à la base de données
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,  // Utiliser l'hôte défini dans les variables d'environnement
  dialect: 'mysql'  // Utiliser MySQL comme dialecte de base de données
});

// Authentifier la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL has been established successfully.');  // Message de succès si la connexion est établie
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);  // Message d'erreur en cas d'échec de connexion
  });

module.exports = sequelize;  // Exporter l'instance Sequelize pour l'utiliser dans d'autres parties de l'application
