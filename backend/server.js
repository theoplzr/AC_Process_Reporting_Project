require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db'); // Connexion Sequelize
const Plan = require('./models/Plan'); // Importer le modèle Plan
const FormData = require('./models/FormData'); // Importer le modèle FormData

const app = express();
const planRoutes = require('./routes/planRoutes');
const port = process.env.PORT || 3000;

// Permettre à Express de servir les fichiers du dossier "uploads"
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour gérer les formulaires

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
