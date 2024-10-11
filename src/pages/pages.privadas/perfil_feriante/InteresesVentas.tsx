import React, { useState } from 'react';

interface InteresesVentaProps {
  intereses: string[];
  setIntereses: (intereses: string[]) => void;
}

const InteresesVenta: React.FC<InteresesVentaProps> = ({ intereses, setIntereses }) => {
  const [nuevoInteres, setNuevoInteres] = useState('');

  const agregarInteres = () => {
    if (nuevoInteres && intereses.length < 10) {
      setIntereses([...intereses, nuevoInteres]);
      setNuevoInteres('');
    }
  };

  const eliminarInteres = (interes: string) => {
    setIntereses(intereses.filter(i => i !== interes));
  };

  return (
    <div>
      <h2>Intereses de Venta</h2>
      <ul>
        {intereses.map((interes, index) => (
          <li key={index}>
            {interes}
            <button onClick={() => eliminarInteres(interes)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <input 
        type="text" 
        value={nuevoInteres} 
        onChange={e => setNuevoInteres(e.target.value)} 
        placeholder="Agregar interés"
      />
      <button onClick={agregarInteres}>Agregar</button>
    </div>
  );
};

export default InteresesVenta;
