/* eslint-disable @typescript-eslint/no-explicit-any */
import '../css/menuD.css'; // Importa el archivo CSS
import React, {  } from 'react';
import { PlanoItemElement, Street } from '../models/vistaplanoModels';



interface MenuCalleProps {
  selectedCalle: PlanoItemElement |  null ;
  onRemoveStreet: (id: number) => void;
  setSelectedItem:(item : PlanoItemElement ) => void;
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
            value={selectedCalle?.dimenciones.x}
            onChange={(e) => handleChange("x", parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Y:
          <input
            type="number"
            value={selectedCalle?.dimenciones.y}
            onChange={(e) => handleChange("y", parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Ancho:
          <input
            type="number"
            value={selectedCalle?.dimenciones.width}
            onChange={(e) => handleChange("width", parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Alto:
          <input
            type="number"
            value={selectedCalle?.dimenciones.height}
            onChange={(e) => handleChange("height", parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default MenuCalle;
