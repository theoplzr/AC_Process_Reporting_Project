import React, { useState } from 'react';
import FormPopup from './FormPopup';
import { FiRefreshCw } from 'react-icons/fi'; // Icon for resetting points
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Plugin for structured table in PDF

const PlanViewer = ({ planUrl, mode }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [points, setPoints] = useState([]);
  const [editingPoint, setEditingPoint] = useState(null);

  // Handle clicking on image to add a new point
  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickPosition({ x, y });
    setFormVisible(true);
    setEditingPoint(null);
  };

  // Handle form submission for the point data
  const handleFormSubmit = (data) => {
    const updatedPoints = editingPoint !== null 
      ? points.map((point, index) =>
          index === editingPoint ? { ...point, data } : point
        )
      : [...points, { x: clickPosition.x, y: clickPosition.y, data, index: points.length + 1 }];

    setPoints(updatedPoints);
    setFormVisible(false);
  };

  // Handle deleting a point
  const handleDeletePoint = () => {
    if (editingPoint !== null) {
      const updatedPoints = points.filter((_, index) => index !== editingPoint);
      setPoints(updatedPoints);
      setFormVisible(false);
    }
  };

  // Handle clicking on a point to edit it
  const handlePointClick = (index) => {
    setClickPosition({ x: points[index].x, y: points[index].y });
    setFormVisible(true);
    setEditingPoint(index);
  };

  // Reset all points
  const resetPoints = () => {
    setPoints([]); // Reset points array
  };

  // Define color of points based on severity
  const getColorFromSeverity = (severity) => {
    switch (severity) {
      case 'red':
        return 'bg-red-600';
      case 'orange':
        return 'bg-orange-500';
      case 'yellow':
        return 'bg-yellow-400';
      case 'green':
        return 'bg-green-600';
      default:
        return 'bg-gray-400';
    }
  };

  // Generate a PDF summarizing point data in a table format, including images
  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Title and Intro Text
    doc.setFontSize(18);
    doc.setTextColor(0, 122, 255); // Tailwind's blue-500 equivalent
    doc.text('Rapport d\'Inspection', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99); // Tailwind's gray-700 equivalent
    doc.text('Ce document contient les observations des points inspectés.', 14, 32);

    // Table headers
    const headers = [
      ['Observation', 'Description', 'Photo', 'Cause', 'Gravité', 'Recommandations'],
    ];

    // Create table rows including image
    const rows = points.map((point, index) => {
      const row = [
        point.data.zoneName || 'N/A',
        point.data.damageDescription || 'Aucune observation',
        '', // Leave space for image (will be added later)
        point.data.probableCause || 'Non spécifiée',
        point.data.severity || 'Non spécifiée',
        point.data.longTermRecommendations || 'Pas de recommandations',
      ];

      return row;
    });

    // Add table to the PDF
    doc.autoTable({
      startY: 40,
      head: headers,
      body: rows,
      theme: 'grid', // Styled table similar to screenshot
      headStyles: {
        fillColor: [0, 122, 255], // Tailwind blue-500
        textColor: [255, 255, 255], // White text
      },
      bodyStyles: {
        textColor: [75, 85, 99], // Tailwind gray-700
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternate rows
      },
      didDrawCell: function (data) {
        // Add images to the third column if available
        const point = points[data.row.index];
        if (data.column.index === 2 && point.data.photos && point.data.photos.length > 0) {
          const img = point.data.photos[0]; // Assuming the first image
          
          // Ensure the image is a valid base64 or URL
          if (typeof img === 'string' && img.startsWith('data:image/')) {
            const imgWidth = 20;
            const imgHeight = 20;
            const xPos = data.cell.x + 2; // Add a small padding
            const yPos = data.cell.y + 2;

            // Ensure the image coordinates and image data are valid
            if (img && xPos >= 0 && yPos >= 0) {
              doc.addImage(img, 'JPEG', xPos, yPos, imgWidth, imgHeight);
            }
          }
        }
      },
    });

    // Footer: Generation date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99); // Tailwind's gray-700
    doc.text(`Document généré le: ${date}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text('A&C Process - Tous droits réservés.', 14, doc.lastAutoTable.finalY + 16);

    // Save the PDF
    doc.save('Rapport_Inspection.pdf');
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen p-6">
      {/* Button to reset all points */}
      <div className="flex justify-end w-full max-w-4xl">
        <button
          onClick={resetPoints}
          className="flex items-center text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg shadow-md transition transform hover:scale-105 mb-4"
        >
          <FiRefreshCw className="mr-2" /> Réinitialiser les points
        </button>
      </div>

      {/* Image container */}
      <div className="relative w-full max-w-4xl">
        <img
          src={`http://localhost:3307/${planUrl}`}  // URL of the uploaded plan
          alt="Plan"
          onClick={handleClick}
          className="w-auto h-auto max-w-full rounded-lg cursor-crosshair shadow-xl"
          style={{ objectFit: 'contain' }}  // Contain the image without distortion
        />
        {points.map((point, index) => (
          <div
            key={index}
            className={`absolute rounded-full w-8 h-8 flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transition-transform duration-300 hover:scale-125 ${getColorFromSeverity(point.data.severity)}`}
            style={{ left: `${point.x}px`, top: `${point.y}px` }}
            onClick={() => handlePointClick(index)}
          >
            {point.index} {/* Display the point number */}
          </div>
        ))}

        {formVisible && (
          <div className="transition-opacity duration-300 opacity-100">
            <FormPopup
              position={clickPosition}
              onSubmit={handleFormSubmit}
              onDelete={handleDeletePoint}
              onClose={() => setFormVisible(false)}
              existingData={editingPoint !== null ? points[editingPoint].data : null}
              mode={mode}  // Pass the selected mode to show the correct form
            />
          </div>
        )}
      </div>

      {/* Display message if no points are added */}
      {!points.length && (
        <p className="text-white text-sm mt-4 animate-pulse">
          Cliquez sur l'image pour ajouter un point.
        </p>
      )}

      {/* Export to PDF Button */}
      {points.length > 0 && (
        <button
          onClick={generatePDF}
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-transform hover:scale-105"
        >
          Exporter en PDF
        </button>
      )}
    </div>
  );
};

export default PlanViewer;
