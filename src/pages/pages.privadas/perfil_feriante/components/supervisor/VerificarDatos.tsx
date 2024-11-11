import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Feriante {
  id_user_fte: number;
  nombre: string;
  apellido: string;
  estado: string;
}

interface VerificarDatosProps {
  id_feria: number;
}

const VerificarDatos: React.FC<VerificarDatosProps> = ({ id_feria }) => {
  const [feriantes, setFeriantes] = useState<Feriante[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeriantes = async () => {
      try {
        setCargando(true);
        const response = await axios.get('http://localhost:5000/api/supervisor/feriantes-activos', {
          params: { id_feria },
        });
        setFeriantes(response.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener la lista de feriantes activos:', error);
        setError('Error al obtener la lista de feriantes activos.');
      } finally {
        setCargando(false);
      }
    };

    fetchFeriantes();
  }, [id_feria]);

  return (
    <div>
      <h2>Verificación de Feriantes Activos</h2>
      {cargando ? (
        <p>Cargando feriantes...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {feriantes.map((feriante) => (
            <li key={feriante.id_user_fte}>
              {feriante.nombre} {feriante.apellido} - Estado: {feriante.estado}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VerificarDatos;