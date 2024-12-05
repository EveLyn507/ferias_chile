import React from 'react';
import './Plano.css'
interface ToolbarProps {
  onAddPuesto: () => void;
  onAddStreet: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddPuesto, onAddStreet }) => {
  return (
      <>
      <button className="toolbar-button" onClick={onAddPuesto}>Agregar Puesto</button>
      <button className="toolbar-button" onClick={onAddStreet}>Agregar Calle</button>

      </>
  );
};

export default Toolbar;