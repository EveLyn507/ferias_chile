import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Puesto {
  numero: number;
  estado: string;
}

const EstadoFeria: React.FC<{ idFeria: number }> = ({ idFeria }) => {
  const [puestos, setPuestos] = useState<Puesto[]>([]);

  useEffect(() => {
    const fetchEstadoPuestos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supervisor/feria/${idFeria}/estado`);
        setPuestos(response.data);
      } catch (error) {
        console.error('Error al obtener el estado de los puestos:', error);
      }
    };

    fetchEstadoPuestos();
  }, [idFeria]);

  return (
    <div>
      <h2>Estado de Puestos en la Feria</h2>
      <ul>
        {puestos.map((puesto) => (
          <li key={puesto.numero}>
            Puesto #{puesto.numero}: {puesto.estado}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EstadoFeria;