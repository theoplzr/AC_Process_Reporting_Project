require('dotenv').config();  // Charger les variables d'environnement depuis le fichier .env
const express = require('express');  // Importer Express pour créer l'application
const cors = require('cors');  // Importer CORS pour gérer les politiques de partage de ressources entre origines
const { PDFDocument, rgb } = require('pdf-lib');  // Importer pdf-lib pour la génération des PDF
const fs = require('fs');
const path = require('path');

const app = express();  // Créer une application Express
const planRoutes = require('./routes/planRoutes'); // Importer les routes pour "Plan"
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

// Utiliser CORS pour autoriser toutes les origines
app.use(cors());

// Middleware pour parser les requêtes avec un corps en JSON
app.use(express.json());

// Associer les routes /api/plans aux routes définies dans 'planRoutes'
app.use('/api/plans', planRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route pour générer un fichier PDF en utilisant un modèle existant
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { mode } = req.body;
    const {
      zoneName, severity, photoDescriptions, materials, generalAppreciation, stepDone,
      workPlanning, improvements, reserve, expertiseMaterials, age, damageNature,
      damageDescription, probableCause, potentialOrigins, immediateRecommendations,
      longTermRecommendations
    } = req.body;

    // Vérifier si le modèle de PDF existe
    const pdfPath = path.join(__dirname, 'template.pdf');
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).send('Le modèle de PDF est introuvable');
    }
    
    const pdfTemplate = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfTemplate);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    let cursorY = 700;
    const lineSpacing = 20;

    // Ajouter les informations de base
    if (zoneName) {
      firstPage.drawText(`Zone : ${zoneName}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
      cursorY -= lineSpacing;
    }
    if (severity) {
      firstPage.drawText(`Niveau de gravité : ${severity}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
      cursorY -= lineSpacing;
    }

    // Vérifier le mode et ajouter les champs spécifiques
    if (mode === 'Supervision') {
      if (materials && materials.length > 0) {
        firstPage.drawText('Matériaux supervisés :', { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
        materials.forEach((material) => {
          firstPage.drawText(` - ${material.material}, Épaisseur : ${material.thickness} mm`, { x: 70, y: cursorY, size: 10 });
          cursorY -= lineSpacing;
        });
      }
      if (generalAppreciation) {
        firstPage.drawText(`Appréciation générale : ${generalAppreciation}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (stepDone) {
        firstPage.drawText(`Étape réalisée : ${stepDone}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (workPlanning) {
        firstPage.drawText(`Planification des travaux : ${workPlanning}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (improvements) {
        firstPage.drawText(`Points d'amélioration : ${improvements}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (reserve) {
        firstPage.drawText(`Durée de réserve : ${reserve}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
    } else if (mode === 'Expertise') {
      if (expertiseMaterials && expertiseMaterials.length > 0) {
        firstPage.drawText('Matériaux analysés :', { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
        expertiseMaterials.forEach((material) => {
          firstPage.drawText(` - ${material.material}, Épaisseur : ${material.thickness} mm`, { x: 70, y: cursorY, size: 10 });
          cursorY -= lineSpacing;
        });
      }
      if (age) {
        firstPage.drawText(`Âge des réparations : ${age}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (damageNature) {
        firstPage.drawText(`Nature de l'endommagement : ${damageNature}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (damageDescription) {
        firstPage.drawText(`Description de l'endommagement : ${damageDescription}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (probableCause) {
        firstPage.drawText(`Cause probable : ${probableCause}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (potentialOrigins) {
        firstPage.drawText(`Origines potentielles : ${potentialOrigins}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (immediateRecommendations) {
        firstPage.drawText(`Recommandations immédiates : ${immediateRecommendations}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
      if (longTermRecommendations) {
        firstPage.drawText(`Recommandations à long terme : ${longTermRecommendations}`, { x: 50, y: cursorY, size: 12, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      }
    }

    // Sauvegarder le PDF modifié
    const pdfBytes = await pdfDoc.save();

    // Envoyer le PDF en réponse
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rapport_personnalise.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).send('Erreur lors de la génération du PDF');
  }
});

// Lancer le serveur Express et écouter sur le port défini
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});