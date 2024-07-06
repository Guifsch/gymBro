// DraggableElement.jsx
import React from 'react';

const DraggableElement = ({ eventTitle }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', eventTitle);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        backgroundColor: 'lightblue',
        padding: '10px',
        margin: '10px',
        cursor: 'move',  // Use 'move' cursor for draggable items
      }}
    >
      {eventTitle}
    </div>
  );
};

export default DraggableElement;