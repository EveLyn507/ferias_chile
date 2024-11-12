/* eslint-disable @typescript-eslint/no-explicit-any */
import '../css/menuD.css'; // Importa el archivo CSS
import React, {  } from 'react';
import { Street } from '../models/vistaplanoModels';



interface MenuCalleProps {
  selectedCalle: Street |  null ;
  onRemoveStreet: (id: number) => void;
  setSelectedItem:(item : Street ) => void;
  isLoading: boolean;
}

const MenuCalle: React.FC<MenuCalleProps> = ({ selectedCalle ,setSelectedItem}) => {


  const handleChange = (field: keyof Street, value: any) => {
    if (!selectedCalle) return;
    
    // Crear un objeto actualizado para pasar a onUpdatePuesto
    const updatedCalle = { ...selectedCalle, [field]: value };
    setSelectedItem(updatedCalle);
  };



  return (
    <div className="menu-container">
         <h3>Modificar Calle</h3>
      <div>
        <label>
          X:
          <input
            type="number"
            value={selectedCalle?.x}
            onChange={(e) => handleChange("x", parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Y:
          <input
            type="number"
            value={selectedCalle?.y}
            onChange={(e) => handleChange("y", parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Ancho:
          <input
            type="number"
            value={selectedCalle?.width}
            onChange={(e) => handleChange("width", parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Alto:
          <input
            type="number"
            value={selectedCalle?.height}
            onChange={(e) => handleChange("height", parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default MenuCalle;
