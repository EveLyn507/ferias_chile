/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react';
import { plano } from '../models/vistaplanoModels';

interface menuPlanoPros {
  plano: plano;
  onChangePlano: (plano: plano) => void;
}

const MenuPlano: React.FC<menuPlanoPros> = ({ plano, onChangePlano }) => {
  const [newW, setW] = useState(plano.width / 100); // Inicia con valores escalados
  const [newH, setH] = useState(plano.height / 100); // Inicia con valores escalados

  const scale = 100;

  const widthInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);

  // Maneja el cambio de valores
  const handleChange = async (field: keyof plano, value: any) => {
    const updatedPlano = { ...plano, [field]: value };
    onChangePlano(updatedPlano);
  };

  // Función que se ejecuta cuando se pierde el foco (blur) de un input
  const handleBlur = (field: keyof plano) => {
    const value = field === 'width' ? newW * scale : newH * scale; // Aplica la escala al valor
    handleChange(field, value);
  };

  // Función que maneja el Enter (hace que el input pierda el foco)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof plano) => {
    if (e.key === 'Enter') {
      handleBlur(field);
      if (field === 'width' && widthInputRef.current) {
        widthInputRef.current.blur();
      }
      if (field === 'height' && heightInputRef.current) {
        heightInputRef.current.blur();
      }
    }
  };

  return (
    <div className="menu-container">
      <div className="menu-content">

    
      <h3>Modificar Plano</h3>
      <div className='input-group'>
        <label>
          Largo:
          <input
            type="number"
            value={newW} // Muestra el valor escalado
            onChange={(e) => setW(parseInt(e.target.value))}
            onBlur={() => handleBlur('width')} // Cuando pierde el foco
            onKeyDown={(e) => handleKeyDown(e, 'width')} // Al presionar Enter
            ref={widthInputRef}
          />
        </label>
  

        <label>
          Alto:
          <input
            type="number"
            value={newH} // Muestra el valor escalado
            onChange={(e) => setH(parseInt(e.target.value))}
            onBlur={() => handleBlur('height')} // Cuando pierde el foco
            onKeyDown={(e) => handleKeyDown(e, 'height')} // Al presionar Enter
            ref={heightInputRef}
          />
        </label>
      </div>
    </div>
    </div>
  );
};

export default MenuPlano;
