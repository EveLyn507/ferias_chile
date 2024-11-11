import React from 'react';
import './Plano.css'
interface ToolbarProps {
  onAddRectangle: () => void;
  onAddArea: () => void;
  onAddStreet: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddRectangle, onAddArea, onAddStreet }) => {
  return (
    <div className="toolbar">
      <button className="toolbar-button" onClick={onAddRectangle}>
        Agregar Puesto
      </button>
      <button className="toolbar-button" onClick={onAddArea}>
        Agregar Área
      </button>
      <button className="toolbar-button" onClick={onAddStreet}>
        Agregar Calle
      </button>
    </div>
  );
};

export default Toolbar;