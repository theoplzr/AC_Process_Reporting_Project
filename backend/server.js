require('dotenv').config();  // Charger les variables d'environnement depuis le fichier .env
const express = require('express');  // Importer Express pour créer l'application
const cors = require('cors');  // Importer CORS pour gérer les politiques de partage de ressources entre origines
const sequelize = require('./config/db');  // Importer la connexion à la base de données Sequelize
const Plan = require('./models/Plan');  // Importer le modèle "Plan" de la base de données
const FormData = require('./models/FormData');  // Importer le modèle "FormData" de la base de données

const app = express();  // Créer une application Express
const planRoutes = require('./routes/planRoutes');  // Importer les routes pour "Plan"
const port = process.env.PORT || 3307;  // Définir le port d'écoute de l'application, utiliser celui dans l'environnement ou 3307 par défaut

// Middleware pour ajouter les en-têtes CORS personnalisés
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permettre toutes les origines
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Méthodes HTTP autorisées
  if (req.method === "OPTIONS") {
    return res.status(200).end();  // Répondre directement aux requêtes preflight CORS
  }
  next();
});

// Utiliser CORS pour autoriser toutes les origines (accès aux ressources depuis n'importe quelle origine)
app.use(cors());  // Middleware CORS

// Middleware pour parser les requêtes avec un corps en JSON
app.use(express.json());

// Associer les routes /api/plans aux routes définies dans 'planRoutes'
app.use('/api/plans', planRoutes);

// Synchroniser la base de données avec Sequelize (force: false permet de ne pas écraser les tables existantes)
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');  // Message de succès si la base de données est synchronisée
  })
  .catch((error) => {
    console.error('Error creating database & tables:', error);  // Message d'erreur en cas d'échec de la synchronisation
  });

// Lancer le serveur Express et écouter sur le port défini
app.listen(port, () => {
  console.log(`Server running on port ${port}`);  // Confirmation que le serveur est démarré
});

// Servir les fichiers statiques depuis le répertoire "uploads"
app.use('/uploads', cors(), express.static('uploads'));
