import React, { useState, useRef } from 'react';
import FormPopup from './FormPopup';
import { FiRefreshCw } from 'react-icons/fi';

const PlanViewer = ({ planUrl, mode }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [points, setPoints] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [currentRect, setCurrentRect] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false); // For tracking when the user is drawing
  const [editingPoint, setEditingPoint] = useState(null);

  const imgRef = useRef(null);

  // Start drawing a rectangle on mouse down
  const handleMouseDown = (event) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCurrentRect({ x, y, width: 0, height: 0 });
    setIsDrawing(true); // Start drawing mode
    setEditingPoint(null); // Start a new zone, not editing an existing point
  };

  // Update rectangle size on mouse move
  const handleMouseMove = (event) => {
    if (!isDrawing) return; // Only draw when mouse is down

    const rect = imgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newWidth = x - currentRect.x;
    const newHeight = y - currentRect.y;

    setCurrentRect((prevRect) => ({
      ...prevRect,
      width: newWidth,
      height: newHeight,
    }));
  };

  // Finish drawing on mouse up
  const handleMouseUp = () => {
    if (isDrawing) {
      // Ensure proper coordinates and size of the rectangle
      const finalRect = {
        ...currentRect,
        x: currentRect.width < 0 ? currentRect.x + currentRect.width : currentRect.x,
        y: currentRect.height < 0 ? currentRect.y + currentRect.height : currentRect.y,
        width: Math.abs(currentRect.width),
        height: Math.abs(currentRect.height),
      };

      setRectangles((prevRectangles) => [...prevRectangles, finalRect]);
      setIsDrawing(false); // Stop drawing mode

      // Calculate center of the rectangle for placing the point
      const centerX = finalRect.x + finalRect.width / 2;
      const centerY = finalRect.y + finalRect.height / 2;

      setClickPosition({ x: centerX, y: centerY });
      setFormVisible(true);
      setEditingPoint(null); // This is a new point, not an edit
    }
  };

  // Prevent the default drag behavior for the image
  const preventDefaultDrag = (event) => {
    event.preventDefault();
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
    setCurrentRect(null); // Exit drawing mode after form submission
  };

  // Handle deleting a point and its associated rectangle
  const handleDeletePoint = () => {
    if (editingPoint !== null) {
      const updatedPoints = points.filter((_, index) => index !== editingPoint);
      const updatedRectangles = rectangles.filter((_, index) => index !== editingPoint);

      setPoints(updatedPoints);
      setRectangles(updatedRectangles);
      setFormVisible(false);
    }
  };

  // Handle clicking on a point to edit it
  const handlePointClick = (index) => {
    const point = points[index];
    setClickPosition({ x: point.x, y: point.y });
    setEditingPoint(index);
    setFormVisible(true); // Open the form to edit the point
  };

  // Reset all points and zones
  const resetPoints = () => {
    setPoints([]); // Reset points
    setRectangles([]); // Reset rectangles
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

  return (
    <div
      className="flex flex-col items-center bg-gray-900 min-h-screen p-6"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp} // Finish drawing on mouse up
    >
      {/* Button to reset all points and zones */}
      <div className="flex justify-end w-full max-w-4xl">
        <button
          onClick={resetPoints}
          className="flex items-center text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg shadow-md transition transform hover:scale-105 mb-4"
        >
          <FiRefreshCw className="mr-2" /> Réinitialiser les points et zones
        </button>
      </div>

      {/* Image container */}
      <div className="relative w-full max-w-4xl">
        <img
          src={`http://localhost:3307/${planUrl}`} // URL of the uploaded plan
          alt="Plan"
          className="w-full h-auto rounded-lg cursor-crosshair shadow-xl"
          ref={imgRef}
          onMouseDown={handleMouseDown}
          onDragStart={preventDefaultDrag} // Prevent default drag behavior
        />

        {/* Display rectangles */}
        {rectangles &&
          rectangles.length > 0 &&
          rectangles.map(
            (rect, index) =>
              rect &&
              rect.x !== null &&
              rect.y !== null &&
              rect.width !== null &&
              rect.height !== null && (
                <div
                  key={index}
                  className="absolute border-2 border-blue-500 bg-blue-300 bg-opacity-30"
                  style={{
                    left: `${rect.x}px`,
                    top: `${rect.y}px`,
                    width: `${rect.width}px`,
                    height: `${rect.height}px`,
                    zIndex: 1, // Lower z-index for the zone
                  }}
                />
              )
          )}

        {/* Display points */}
        {points.map((point, index) => (
          <div
            key={index}
            className={`absolute rounded-full w-8 h-8 flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transition-transform duration-300 hover:scale-125 ${getColorFromSeverity(
              point.data.severity
            )}`}
            style={{ left: `${point.x - 16}px`, top: `${point.y - 16}px`, zIndex: 10 }} // Higher z-index for points
            onClick={() => handlePointClick(index)}
          >
            {point.index} {/* Display the point number */}
          </div>
        ))}

        {/* Display current rectangle while drawing */}
        {currentRect && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-300 bg-opacity-30"
            style={{
              left: `${currentRect.x}px`,
              top: `${currentRect.y}px`,
              width: `${Math.abs(currentRect.width)}px`,
              height: `${Math.abs(currentRect.height)}px`,
              zIndex: 1, // Lower z-index for the drawing rectangle
            }}
          />
        )}
      </div>

      {/* Display message if no points are added */}
      {!points.length && (
        <p className="text-white text-sm mt-4 animate-pulse">
          Cliquez sur l'image pour ajouter un point ou tracer une zone.
        </p>
      )}

      {formVisible && (
        <div className="transition-opacity duration-300 opacity-100">
          <FormPopup
            position={clickPosition}
            onSubmit={handleFormSubmit}
            onDelete={handleDeletePoint}
            onClose={() => setFormVisible(false)}
            existingData={editingPoint !== null ? points[editingPoint].data : null}
            mode={mode} // Pass the selected mode to show the correct form
          />
        </div>
      )}
    </div>
  );
};

export default PlanViewer;
