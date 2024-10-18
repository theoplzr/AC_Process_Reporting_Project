import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const GeneratePDF = ({ points }) => {
  // Fonction pour générer le PDF
  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Titre du rapport
    doc.setFontSize(18);
    doc.setTextColor(0, 122, 255);
    doc.text('Rapport Détail des Points', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    doc.text('Ce document détaille les informations de chaque point enregistré.', 14, 32);

    let currentY = 40;

    for (const [index, point] of points.entries()) {
      // Ajouter une section pour chaque point
      doc.setFontSize(16);
      doc.setTextColor(0, 122, 255);
      doc.text(`Point ${index + 1}`, 14, currentY);

      const pointData = [
        ['Zone', point.data.zoneName || 'Non spécifiée'],
        ['Gravité', point.data.severity || 'Non spécifiée'],
        ['Appréciation Générale', point.data.generalAppreciation || 'Non spécifiée'],
        ['Étape Réalisée', point.data.stepDone || 'Non spécifiée'],
        ['Planification Travaux', point.data.workPlanning || 'Non spécifiée'],
        ['Améliorations Proposées', point.data.improvements || 'Non spécifiées'],
        ['Réserve', point.data.reserve || 'Non spécifiée'],
        ['Matériaux (Supervision)', point.data.materials ? point.data.materials.map(m => `${m.material} (${m.thickness})`).join(', ') : 'Non spécifié'],
        ['Âge (Expertise)', point.data.age || 'Non spécifiée'],
        ['Nature des Dommages', point.data.damageNature || 'Non spécifiée'],
        ['Description des Dommages', point.data.damageDescription || 'Non spécifiée'],
        ['Cause Probable', point.data.probableCause || 'Non spécifiée'],
        ['Origines Potentielles', point.data.potentialOrigins || 'Non spécifiées'],
        ['Recommandations Immédiates', point.data.immediateRecommendations || 'Non spécifiées'],
        ['Recommandations Long Terme', point.data.longTermRecommendations || 'Non spécifiées'],
        ['Description des Photos', point.data.photoDescriptions ? point.data.photoDescriptions.join(', ') : 'Aucune description'],
      ];

      doc.autoTable({
        startY: currentY + 10,
        head: [['Champ', 'Valeur']],
        body: pointData,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 122, 255],
          textColor: [255, 255, 255],
        },
        bodyStyles: {
          textColor: [75, 85, 99],
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // Ajouter les photos (s'il y en a)
      if (point.data.photos && point.data.photos.length > 0) {
        for (const [photoIndex, photo] of point.data.photos.entries()) {
          const imgData = await getBase64Image(photo);
          if (imgData) {
            doc.addImage(imgData, 'JPEG', 14, currentY, 50, 50);
            doc.text(`Photo ${photoIndex + 1}`, 70, currentY + 25);
            currentY += 60;
          }
        }
      }

      currentY += 20;
    }

    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Document généré le: ${date}`, 14, currentY + 10);
    doc.text('A&C Process - Tous droits réservés.', 14, currentY + 16);

    doc.save('Rapport_Points_Inspection.pdf');
  };

  const getBase64Image = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  return (
    <div>
      <button onClick={generatePDF} className="bg-blue-500 text-white p-2 rounded-lg">
        Exporter en PDF
      </button>

      <div className="mt-4 p-4 border">
        <h2 className="text-xl font-bold">Aperçu du Rapport</h2>
        <p>Ce rapport exportera toutes les informations pour chaque point créé, sous forme de tableau récapitulatif.</p>
      </div>
    </div>
  );
};

export default GeneratePDF;
