import React from 'react';
import './Plano.css'
interface ToolbarProps {
  onAddPuesto: () => void;
  handleSaveJson: () => void;
  onAddStreet: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddPuesto,handleSaveJson, onAddStreet }) => {
  return (
    <div className="toolbar">
      <button className="toolbar-button" onClick={onAddPuesto}>Agregar Puesto</button>
      <button className="toolbar-button" onClick={onAddStreet}>Agregar Calle</button>
      <button className="toolbar-button" onClick={handleSaveJson}>Guardar plano</button>
    </div>
  );
};

export default Toolbar;