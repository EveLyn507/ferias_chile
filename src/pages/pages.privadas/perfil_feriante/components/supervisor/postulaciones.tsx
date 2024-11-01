import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Postulacion {
  id: number;
  feria: string;
  estado: string;
}

const Postulaciones: React.FC = () => {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/supervisor/postulaciones');
        setPostulaciones(response.data);
      } catch (error) {
        console.error('Error al obtener postulaciones:', error);
      }
    };

    fetchPostulaciones();
  }, []);

  return (
    <div>
      <h2>Postulaciones a Ferias</h2>
      <ul>
        {postulaciones.map((postulacion) => (
          <li key={postulacion.id}>
            Feria: {postulacion.feria} - Estado: {postulacion.estado}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Postulaciones;