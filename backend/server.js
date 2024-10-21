require('dotenv').config();  // Charger les variables d'environnement depuis le fichier .env
const express = require('express');  // Importer Express pour créer l'application
const cors = require('cors');  // Importer CORS pour gérer les politiques de partage de ressources entre origines
const sequelize = require('./config/db');  // Importer la connexion à la base de données Sequelize
const Plan = require('./models/Plan');  // Importer le modèle "Plan" de la base de données
const FormData = require('./models/FormData');  // Importer le modèle "FormData" de la base de données
const { PDFDocument, rgb } = require('pdf-lib');  // Importer pdf-lib pour la génération des PDF

const app = express();  // Créer une application Express
const planRoutes = require('./routes/planRoutes');// Importer les routes pour "Plan"
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

// Route pour générer le fichier PDF
app.post('/api/generate-pdf', async (req, res) => {
  const { points, rectangles } = req.body;

  try {
    // Créer un nouveau document PDF
    const pdfDoc = await PDFDocument.create();

    // Ajouter une page au PDF
    const page = pdfDoc.addPage([600, 800]);

    // Styles pour le texte
    const fontSize = 12;
    const titleSize = 18;

    // Titre du PDF
    page.drawText('Rapport des Points et Zones', {
      x: 50,
      y: page.getHeight() - 50,
      size: titleSize,
      color: rgb(0, 0.53, 1),
    });

    let cursorY = page.getHeight() - 100;

    // Section des Points
    page.drawText('Points:', { x: 50, y: cursorY, size: fontSize });
    cursorY -= 20;

    points.forEach((point, index) => {
      const pointText = `Point ${index + 1} - X: ${point.x}, Y: ${point.y}, Data: ${JSON.stringify(point.data)}`;
      page.drawText(pointText, { x: 50, y: cursorY, size: fontSize });
      cursorY -= 20;
    });

    cursorY -= 20;
    page.drawText('Zones:', { x: 50, y: cursorY, size: fontSize });
    cursorY -= 20;

    // Section des Zones
    rectangles.forEach((rect, index) => {
      const rectText = `Zone ${index + 1} - X: ${rect.x}, Y: ${rect.y}, Width: ${rect.width}, Height: ${rect.height}`;
      page.drawText(rectText, { x: 50, y: cursorY, size: fontSize });
      cursorY -= 20;
    });

    // Générer le fichier PDF
    const pdfBytes = await pdfDoc.save();

    // Envoyer le PDF en réponse
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rapport_points_zones.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).send('Erreur lors de la génération du PDF');
  }
});

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
