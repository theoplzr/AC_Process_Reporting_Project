const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour l'upload d'image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route pour uploader un plan
router.post('/upload', upload.single('plan'), planController.uploadPlan);

// Route pour sauvegarder les données du formulaire
router.post('/save', planController.saveFormData);

module.exports = router; 
