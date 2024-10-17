import React from 'react';
import jsPDF from 'jspdf';

const GeneratePDFButton = ({ points, canvasRef }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Vérifier si le canvas est disponible avant d'essayer de générer le PDF
    const canvas = canvasRef?.current;
    if (canvas) {
      const planImage = canvas.toDataURL('image/png', 1.0);  // Convertir le canvas en image PNG
      doc.addImage(planImage, 'PNG', 10, yPosition, 180, 120);  // Ajouter l'image du canvas au PDF
      yPosition += 130;
    } else {
      console.error('Le canvas n\'est pas disponible !');
      return;
    }

    // Traiter chaque point et ajouter le contenu au PDF
    points.forEach((point, index) => {
      doc.text(`Point ${index + 1}`, 10, yPosition);
      doc.text(`Gravité : ${point.data.severity}`, 10, yPosition + 10);
      doc.text(`Étapes de reconstruction : ${point.data.response}`, 10, yPosition + 20);
      doc.text(`Matériaux : ${point.data.materials}`, 10, yPosition + 30);
      yPosition += 40;

      // Si la hauteur dépasse la page, ajouter une nouvelle page
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save('Rapport_Supervision.pdf');
  };

  return (
    <button
      className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={generatePDF}
    >
      Générer le PDF
    </button>
  );
};

export default GeneratePDFButton;
