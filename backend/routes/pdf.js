// routes/pdf.js
const express = require('express');
const { PDFDocument, rgb } = require('pdf-lib'); // Import pdf-lib pour créer des PDF
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/generate-pdf', async (req, res) => {
  const {
    mode, zoneName, severity, materials, generalAppreciation, stepDone,
    workPlanning, improvements, reserve, photos, photoDescriptions
  } = req.body;

  try {
    const pdfTemplatePath = path.join(__dirname, '../template.pdf');

    if (!fs.existsSync(pdfTemplatePath)) {
      return res.status(404).send('Le modèle de PDF est introuvable.');
    }

    const pdfTemplate = fs.readFileSync(pdfTemplatePath);
    const pdfDoc = await PDFDocument.load(pdfTemplate);

    let pages = pdfDoc.getPages();
    let firstPage = pages[0];

    let cursorY = 700;
    const lineSpacing = 20;
    const fontSize = 12;

    if (zoneName) {
      firstPage.drawText(`Zone : ${zoneName}`, { x: 50, y: cursorY, size: fontSize, color: rgb(0, 0, 0) });
      cursorY -= lineSpacing;
    }
    if (severity) {
      firstPage.drawText(`Niveau de gravité : ${severity}`, { x: 50, y: cursorY, size: fontSize, color: rgb(0, 0, 0) });
      cursorY -= lineSpacing;
    }

    if (mode === 'Supervision' && materials && materials.length > 0) {
      firstPage.drawText('Matériaux supervisés :', { x: 50, y: cursorY, size: fontSize, color: rgb(0, 0, 0) });
      cursorY -= lineSpacing;
      materials.forEach((material) => {
        firstPage.drawText(` - ${material.material}, Épaisseur : ${material.thickness} mm`, { x: 70, y: cursorY, size: fontSize - 2, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;
      });
    }

    if (generalAppreciation) {
      firstPage.drawText(`Appréciation générale : ${generalAppreciation}`, { x: 50, y: cursorY, size: fontSize, color: rgb(0, 0, 0) });
      cursorY -= lineSpacing;
    }

    if (photos && photoDescriptions) {
      firstPage.drawText('Descriptions des photos et documents :', { x: 50, y: cursorY, size: fontSize, color: rgb(0, 0, 0) });
      cursorY -= lineSpacing;

      for (let i = 0; i < photos.length; i++) {
        firstPage.drawText(`Élément ${i + 1} : ${photoDescriptions[i]}`, { x: 70, y: cursorY, size: fontSize - 2, color: rgb(0, 0, 0) });
        cursorY -= lineSpacing;

        const base64Data = photos[i].split(',')[1];

        if (!base64Data) {
          console.error(`Erreur : Les données de l'élément ${i + 1} sont manquantes.`);
          continue;
        }

        const mimeType = photos[i].split(',')[0].split(':')[1].split(';')[0];

        if (mimeType.startsWith('image/')) {
          const imageBytes = Buffer.from(base64Data, 'base64');
          const image = mimeType === 'image/png' ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);
          const { width, height } = image.scale(0.5);

          if (cursorY - height < 0) {
            cursorY = 700;
            const newPage = pdfDoc.addPage();
            firstPage = newPage;
          }

          firstPage.drawImage(image, {
            x: 50,
            y: cursorY - height,
            width,
            height,
          });
          cursorY -= (height + lineSpacing);
        } else if (mimeType === 'application/pdf') {
          const pdfBytes = Buffer.from(base64Data, 'base64');
          const pdfToAdd = await PDFDocument.load(pdfBytes);
          const copiedPages = await pdfDoc.copyPages(pdfToAdd, pdfToAdd.getPageIndices());
          copiedPages.forEach((page) => {
            pdfDoc.addPage(page);
          });
        }
      }
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rapport_supervision.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).send('Erreur lors de la génération du PDF');
  }
});

// Route pour convertir un PDF en base64
router.get('/pdf-to-base64', (req, res) => {
  let fileName = req.query.fileName; 

  // Valider le paramètre fileName
  if (!fileName) {
    return res.status(400).json({ error: 'Le nom du fichier est requis.' });
  }

  // Nettoyer les espaces et les retours à la ligne du nom de fichier
  fileName = fileName.trim();

  // Construire le chemin du fichier PDF à partir du nom du fichier
  const filePath = path.join(__dirname, '../photos', fileName);
  console.log("Valeur de __dirname :", __dirname);
  console.log("Nom de fichier nettoyé :", fileName);
  console.log("Chemin absolu vérifié :", filePath);

  // Vérifier si le fichier existe
  if (!fs.existsSync(filePath)) {
    console.error(`Fichier non trouvé : ${filePath}`);
    return res.status(404).json({ error: 'Le fichier est introuvable.' });
  }

  // Lire le fichier et le convertir en base64
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier :', err);
      return res.status(500).json({ error: 'Erreur lors de la lecture du fichier.' });
    }

    // Déterminer le type MIME du fichier
    const ext = path.extname(fileName).toLowerCase();
    let mimeType = 'application/octet-stream'; // Par défaut

    if (ext === '.jpg' || ext === '.jpeg') {
      mimeType = 'image/jpeg';
    } else if (ext === '.png') {
      mimeType = 'image/png';
    } else if (ext === '.pdf') {
      mimeType = 'application/pdf';
    }

    // Convertir le fichier en base64
    const base64String = data.toString('base64');
    res.json({ base64: `data:${mimeType};base64,${base64String}` });
  });
});

router.get('/test', (req, res) => {
  res.send("Route de test PDF fonctionnelle !");
});

module.exports = router;
