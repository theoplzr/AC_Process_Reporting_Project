import React, { useState, useRef } from 'react';
import FormPopup from './FormPopup';
import { FiRefreshCw } from 'react-icons/fi';

const PlanViewer = ({ planUrl, mode }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [points, setPoints] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [formData, setFormData] = useState({});

  const [currentRect, setCurrentRect] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingPointIndex, setDraggingPointIndex] = useState(null);
  const [editingPoint, setEditingPoint] = useState(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [jsonData, setJsonData] = useState({ points: [], rectangles: [] });

  const imgRef = useRef(null);

  const handleMouseDown = (event) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
      setCurrentRect({ x, y, width: 0, height: 0 });
      setIsDrawing(true);
      setEditingPoint(null);
    }
  };

  const handleMouseMove = (event) => {
    const imgRect = imgRef.current.getBoundingClientRect();

    if (isDrawing) {
      const x = Math.min(Math.max(event.clientX - imgRect.left, 0), imgRect.width);
      const y = Math.min(Math.max(event.clientY - imgRect.top, 0), imgRect.height);

      const newWidth = x - currentRect.x;
      const newHeight = y - currentRect.y;

      setCurrentRect((prevRect) => ({
        ...prevRect,
        width: newWidth,
        height: newHeight,
      }));
    } else if (isDragging && draggingPointIndex !== null) {
      const rect = rectangles[draggingPointIndex];
      const rectWidth = rect.width;
      const rectHeight = rect.height;

      const x = Math.min(
        Math.max(event.clientX - imgRect.left, rectWidth / 2),
        imgRect.width - rectWidth / 2
      );
      const y = Math.min(
        Math.max(event.clientY - imgRect.top, rectHeight / 2),
        imgRect.height - rectHeight / 2
      );

      setPoints((prevPoints) =>
        prevPoints.map((point, index) =>
          index === draggingPointIndex ? { ...point, x, y } : point
        )
      );

      setRectangles((prevRectangles) =>
        prevRectangles.map((rect, index) =>
          index === draggingPointIndex
            ? {
                ...rect,
                x: x - rectWidth / 2,
                y: y - rectHeight / 2,
              }
            : rect
        )
      );

      setHasMoved(true);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      const finalRect = {
        ...currentRect,
        x: currentRect.width < 0 ? currentRect.x + currentRect.width : currentRect.x,
        y: currentRect.height < 0 ? currentRect.y + currentRect.height : currentRect.y,
        width: Math.abs(currentRect.width),
        height: Math.abs(currentRect.height),
      };

      setRectangles((prevRectangles) => [...prevRectangles, finalRect]);
      setIsDrawing(false);

      const centerX = finalRect.x + finalRect.width / 2;
      const centerY = finalRect.y + finalRect.height / 2;

      setClickPosition({ x: centerX, y: centerY });
      setFormVisible(true);
      setEditingPoint(null);
    }

    setIsDragging(false);
    setDraggingPointIndex(null);
  };

  // Start dragging a point
  const handlePointMouseDown = (index, event) => {
    setIsDragging(true);
    setDraggingPointIndex(index);
    setHasMoved(false);
    event.stopPropagation();
  };

  // Handle clicking on a point to open form (only if it wasn't moved)
  const handlePointClick = (index) => {
    if (!hasMoved) {
      const point = points[index];
      setClickPosition({ x: point.x, y: point.y });
      setEditingPoint(index);
      setFormVisible(true);
    }
  };

  // Prevent default drag behavior for the image
  const preventDefaultDrag = (event) => {
    event.preventDefault();
  };

  // Handle form submission for point data
  // Handle form submission for point data
  // Handle form submission for point data
  const handleFormSubmit = (data) => {
    const updatedPoints = editingPoint !== null
      ? points.map((point, index) =>
          index === editingPoint ? { ...point, data } : point
        )
      : [...points, { x: clickPosition.x, y: clickPosition.y, data, index: points.length + 1 }];
  
    setPoints(updatedPoints);
    setFormVisible(false);
  
    // Ensure the area remains after saving
    if (currentRect && currentRect.width > 0 && currentRect.height > 0) {
      setRectangles((prevRectangles) => [...prevRectangles, currentRect]);
    }
  
    // Update jsonData in memory with the latest points and rectangles
    setJsonData({ points: updatedPoints, rectangles });
  
    // Reset currentRect after saving
    setCurrentRect(null);
  };
  

  const handleFormClose = () => {
    setFormVisible(false);
    setCurrentRect(null);
  };

  const handleDeletePoint = () => {
    if (editingPoint !== null) {
      const updatedPoints = points.filter((_, index) => index !== editingPoint);
      const updatedRectangles = rectangles.filter((_, index) => index !== editingPoint);

      setPoints(updatedPoints);
      setRectangles(updatedRectangles);
      setFormVisible(false);
    }
  };

  const resetPoints = () => {
    setPoints([]);
    setRectangles([]);
    setJsonData({ points: [], rectangles: [] });  // Reset jsonData here
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

  const generatePDF = async () => {
    try {
      const pdfData = {
        ...formData,
        points,
        rectangles
      };

      const response = await fetch('http://localhost:3307/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points: jsonData.points, rectangles: jsonData.rectangles }),  // Use jsonData here
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rapport_personnalise.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  };
  

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen p-6" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="flex justify-end w-full max-w-4xl">
        <button onClick={resetPoints} className="flex items-center text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg shadow-md transition transform hover:scale-105 mb-4">
          <FiRefreshCw className="mr-2" /> Réinitialiser les points et zones
        </button>
      </div>

      <div className="relative w-full max-w-4xl">
        <img src={`http://localhost:3307/${planUrl}`} alt="Plan" className="rounded-lg cursor-crosshair shadow-xl" ref={imgRef} onMouseDown={handleMouseDown} onDragStart={(e) => e.preventDefault()} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />

        {isDrawing && currentRect && (
          <div className="absolute border-2 border-blue-500 bg-blue-300 bg-opacity-30" style={{ left: `${currentRect.x}px`, top: `${currentRect.y}px`, width: `${currentRect.width}px`, height: `${currentRect.height}px` }} />
        )}

        {Array.isArray(rectangles) && rectangles.map((rect, index) => (
          <div key={index} className="absolute border-2 border-blue-500 bg-blue-300 bg-opacity-30" style={{ left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.width}px`, height: `${rect.height}px`, zIndex: 1 }} />
        ))}

        {points.map((point, index) => (
          <div key={index} className={`absolute rounded-full w-3 h-3 flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transition-transform duration-300 hover:scale-125 ${getColorFromSeverity(point.data.severity)}`} style={{ left: `${point.x - 6}px`, top: `${point.y - 6}px`, zIndex: 2 }} onMouseDown={(event) => { setIsDragging(true); setDraggingPointIndex(index); }} onClick={() => { setClickPosition({ x: point.x, y: point.y }); setEditingPoint(index); setFormVisible(true); }}>
            {point.index}
          </div>
        ))}

        {formVisible && (
          <div className="transition-opacity duration-300 opacity-100">
            <FormPopup position={clickPosition} onSubmit={handleFormSubmit} onDelete={handleDeletePoint} onClose={handleFormClose} existingData={editingPoint !== null ? points[editingPoint].data : null} mode={mode} />
          </div>
        )}
      </div>

      <button onClick={generatePDF} className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-transform hover:scale-105">
        Télécharger PDF
      </button>

      {!points.length && (
        <p className="text-white text-sm mt-4 animate-pulse">
          Cliquez sur l'image pour ajouter une zone.
        </p>
      )}
    </div>
  );
};

export default PlanViewer;
