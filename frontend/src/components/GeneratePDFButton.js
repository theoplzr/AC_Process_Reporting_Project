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

    // Transformer les données en phrases
    points.forEach((point, index) => {
      const severityText = getSeverityDescription(point.data.severity);
      const responseText = point.data.response ? `Les étapes de reconstruction effectuées sont : ${point.data.response}.` : 'Aucune étape de reconstruction spécifiée.';
      const materialsText = point.data.materials ? `Les matériaux utilisés comprennent : ${point.data.materials}.` : 'Aucun matériau précisé.';
      const practicesText = point.data.practices ? `Les bonnes pratiques observées sont : ${point.data.practices}.` : 'Aucune bonne pratique observée.';
      const anomaliesText = point.data.anomalies ? `Les anomalies notées sont : ${point.data.anomalies}.` : 'Aucune anomalie n\'a été signalée.';
      const maintenanceText = point.data.maintenance ? `Le plan de maintenance proposé est : ${point.data.maintenance}.` : 'Aucun plan de maintenance spécifié.';

      doc.text(`Point ${index + 1}`, 10, yPosition);
      doc.text(severityText, 10, yPosition + 10);
      doc.text(responseText, 10, yPosition + 20);
      doc.text(materialsText, 10, yPosition + 30);
      doc.text(practicesText, 10, yPosition + 40);
      doc.text(anomaliesText, 10, yPosition + 50);
      doc.text(maintenanceText, 10, yPosition + 60);
      yPosition += 70;

      // Si la hauteur dépasse la page, ajouter une nouvelle page
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save('Rapport_Supervision.pdf');
  };

  // Fonction pour obtenir une description de la gravité
  const getSeverityDescription = (severity) => {
    switch (severity) {
      case 'red':
        return 'Gravité : Non-conformité majeure.';
      case 'orange':
        return 'Gravité : Non-conformité mineure.';
      case 'lightgreen':
        return 'Gravité : Améliorable.';
      case 'green':
        return 'Gravité : Conforme.';
      default:
        return 'Gravité non spécifiée.';
    }
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
