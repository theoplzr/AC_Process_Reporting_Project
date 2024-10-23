const express = require('express');
const { PDFDocument, rgb } = require('pdf-lib'); // Import pdf-lib pour créer des PDF
const router = express.Router();

router.post('/generate-pdf', async (req, res) => {
  const { points, rectangles } = req.body;

  try {
    // Créer un nouveau document PDF
    const pdfDoc = await PDFDocument.create();

    // Ajouter une page au PDF
    const page = pdfDoc.addPage([600, 800]);

    // Définir des styles pour les textes
    const fontSize = 12;
    const titleSize = 18;
    
    // Titre du PDF
    page.drawText('Rapport des Points et Zones', {
      x: 50,
      y: page.getHeight() - 50,
      size: titleSize,
      color: rgb(0, 0.53, 1),
    });

    // Positionner le curseur pour le texte suivant
    let cursorY = page.getHeight() - 100;

    // Générer la section des Points
    page.drawText('Points:', { x: 50, y: cursorY, size: fontSize });
    cursorY -= 20;

    points.forEach((point, index) => {
      const pointText = `Point ${index + 1} - X: ${point.x}, Y: ${point.y}, Data: ${JSON.stringify(point.data)}`;
      page.drawText(pointText, { x: 50, y: cursorY, size: fontSize });
      cursorY -= 20;
    });

    // Générer la section des Zones
    cursorY -= 20;
    page.drawText('Zones:', { x: 50, y: cursorY, size: fontSize });
    cursorY -= 20;

    rectangles.forEach((rect, index) => {
      const rectText = `Zone ${index + 1} - X: ${rect.x}, Y: ${rect.y}, Width: ${rect.width}, Height: ${rect.height}`;
      page.drawText(rectText, { x: 50, y: cursorY, size: fontSize });
      cursorY -= 20;
    });

    // Générer le fichier PDF final
    const pdfBytes = await pdfDoc.save();

    // Envoyer le fichier PDF en tant que réponse
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rapport_points_zones.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Erreur lors de la génération du PDF', error);
    res.status(500).send('Erreur lors de la génération du PDF');
  }
});

module.exports = router;