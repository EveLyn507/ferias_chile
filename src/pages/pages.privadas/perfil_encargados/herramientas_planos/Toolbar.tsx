import React from 'react';

interface ToolbarProps {
  onAddRectangle: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddRectangle }) => {
  return (
    <div className="toolbar">
      <button onClick={onAddRectangle}>Agregar Puesto</button>
    </div>
  );
};

export default Toolbar;