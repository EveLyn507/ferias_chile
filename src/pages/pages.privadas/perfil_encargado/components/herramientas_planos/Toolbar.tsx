import React from 'react';

interface ToolbarProps {
  onAddPuesto: () => void;
  handleSaveJson: () => void;
  onAddStreet: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddPuesto,handleSaveJson, onAddStreet }) => {
  return (
    <div className="toolbar">
      <button onClick={onAddPuesto}>Agregar Puesto</button>
      <button onClick={onAddStreet}>Agregar Calle</button>
      <button onClick={handleSaveJson}>Guardar plano</button>
    </div>
  );
};

export default Toolbar;