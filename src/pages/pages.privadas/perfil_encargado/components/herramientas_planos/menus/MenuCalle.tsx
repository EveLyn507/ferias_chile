/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {  } from 'react';
import { PlanoItemElement, Street } from '../models/vistaplanoModels';



interface MenuCalleProps {
  selectedCalle: PlanoItemElement |  null ;
  setSelectedItem:(item : PlanoItemElement ) => void;
  deleteItem: (item : PlanoItemElement) => void;
  isLoading: boolean;
}

const MenuCalle: React.FC<MenuCalleProps> = ({ selectedCalle ,setSelectedItem , deleteItem}) => {

const scale = 100
  const handleChange = (field: keyof Street, value: any) => {
    if (!selectedCalle) return;
    if (field === "width" || field === "height") {
      value = value * scale; // Convertimos el valor a píxeles si es necesario
    }
  
    // Crear un objeto actualizado para pasar a onUpdatePuesto
    const updatedCalle = { ...selectedCalle, dimenciones : { ...selectedCalle.dimenciones , [field]: value}  };
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
            onChange={(e) => handleChange("x", parseInt(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Y:
          <input
            type="number"
            value={selectedCalle?.dimenciones.y}
            onChange={(e) => handleChange("y", parseInt(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Ancho:
          <input
            type="number"
            value={selectedCalle!.dimenciones.width / scale}
            onChange={(e) => handleChange("width", parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Alto:
          <input
            type="number"
            value={selectedCalle!.dimenciones.height / scale}
            onChange={(e) => handleChange("height", parseInt(e.target.value))}
          />
        </label>
      </div>
      <button onClick={() => deleteItem(selectedCalle!)}>ELIMINAR</button>
    </div>
  );
};

export default MenuCalle;
