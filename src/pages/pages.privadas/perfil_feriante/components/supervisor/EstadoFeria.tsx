import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EstadoFeria: React.FC = () => {
  const [estadoFeria, setEstadoFeria] = useState([]);

  useEffect(() => {
    const fetchEstadoFeria = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/estado-feria');
        setEstadoFeria(response.data);
      } catch (error) {
        console.error('Error al obtener el estado de la feria:', error);
      }
    };
    fetchEstadoFeria();
  }, []);

  return (
    <div>
      <h2>Ocupación de Ferias Activas</h2>
      <ul>
        {estadoFeria.map((feria, index) => (
          <li key={index}>
            {feria.nombre}: {feria.ocupacion} puestos ocupados de {feria.total_puestos}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EstadoFeria;
