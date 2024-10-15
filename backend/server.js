require('dotenv').config();
const express = require('express');
const cors = require('cors');  // Importer cors
const sequelize = require('./config/db'); // Connexion Sequelize
const Plan = require('./models/Plan'); // Importer le modèle Plan
const FormData = require('./models/FormData'); // Importer le modèle FormData

const app = express();
const planRoutes = require('./routes/planRoutes');
const port = process.env.PORT || 3307;

// Utiliser cors pour autoriser toutes les origines
app.use(cors());  // Ajouter cors ici

// Middleware pour parser le JSON
app.use(express.json());

// Utilisation des routes
app.use('/api/plans', planRoutes);

// Synchroniser la base de données et créer les tables si elles n'existent pas
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Error creating database & tables:', error);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('/uploads', express.static('uploads'));
