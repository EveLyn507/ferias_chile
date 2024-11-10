import React, { useState, useEffect } from 'react';

interface Street {
  id: number;
  points: number[];
  width: number;
  height: number;
}

interface MenuCalleProps {
  calle: Street;
  onClose: () => void;
  onSizeChange: (width: number, height: number) => void;
}

const MenuCalle: React.FC<MenuCalleProps> = ({ calle, onClose, onSizeChange }) => {
  const [width, setWidth] = useState(calle.width);
  const [height, setHeight] = useState(calle.height);

  useEffect(() => {
    setWidth(calle.width);
    setHeight(calle.height);
  }, [calle]);

  const handleSave = () => {
    onSizeChange(width, height);  // Llamar a onSizeChange con los nuevos valores
    onClose();  // Cerrar el menú
  };

  console.log("Renderizando MenuCalles");

  return (
    <div className="menu-calle">
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
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default MenuCalle;
