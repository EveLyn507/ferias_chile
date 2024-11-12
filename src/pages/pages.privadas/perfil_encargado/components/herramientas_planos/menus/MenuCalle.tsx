import '../css/menuD.css'; // Importa el archivo CSS
import React, { useState, useEffect } from 'react';

interface Street {
  id: number;
  points: number[];
  width: number;
  height: number;
}

interface MenuCalleProps {
  selectedCalle: Street ;
  onSizeChange : (id: number, updatedProps: Partial<Street>) => void;
  onRemoveStreet: (id: number) => void;
  isLoading: boolean;
}

const MenuCalle: React.FC<MenuCalleProps> = ({ selectedCalle, onSizeChange }) => {
  const [width, setWidth] = useState(selectedCalle.width);
  const [height, setHeight] = useState(selectedCalle.height);

  useEffect(() => {
    setWidth(selectedCalle.width);
    setHeight(selectedCalle.height);
  }, [selectedCalle]);

  const handleSave = () => {
    onSizeChange(selectedCalle.id, selectedCalle);  // Llamar a onSizeChange con los nuevos valores

  };



  return (
    <div className="menu-container">
      <h3>Modificar Calle</h3>
      <div>
        <label>
          Ancho:
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Alto:
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
};

export default MenuCalle;
