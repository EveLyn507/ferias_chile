import { useState } from 'react';

const RedesSociales = () => {
  const [enlaces, setEnlaces] = useState<string[]>([]);
  const [nuevoEnlace, setNuevoEnlace] = useState('');

  const agregarEnlace = () => {
    if (nuevoEnlace) {
      setEnlaces([...enlaces, nuevoEnlace]);
      setNuevoEnlace('');
    }
  };

  const eliminarEnlace = (enlace: string) => {
    setEnlaces(enlaces.filter(e => e !== enlace));
  };

  return (
    <div>
      <h2>Redes Sociales</h2>
      <ul>
        {enlaces.map((enlace, index) => (
          <li key={index}>
            {enlace}
            <button onClick={() => eliminarEnlace(enlace)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <input 
        type="text" 
        value={nuevoEnlace} 
        onChange={e => setNuevoEnlace(e.target.value)} 
        placeholder="Agregar enlace"
      />
      <button onClick={agregarEnlace}>Agregar</button>
    </div>
  );
};

export default RedesSociales;
