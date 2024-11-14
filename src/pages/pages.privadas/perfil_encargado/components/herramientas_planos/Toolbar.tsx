import React from 'react';
import './Plano.css'
interface ToolbarProps {
  onAddPuesto: () => void;
  onAddStreet: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddPuesto, onAddStreet }) => {
  return (
    <div className="toolbar">
      <button className="toolbar-button" onClick={onAddPuesto}>Agregar Puesto</button>
      <button className="toolbar-button" onClick={onAddStreet}>Agregar Calle</button>

    </div>
  );
};

export default Toolbar;