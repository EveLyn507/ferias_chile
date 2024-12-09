import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RegistroCobrosFisicos from './RegistroCobrosFisicos';

interface Feriante {
  id_user_fte: number;
  nombre: string;
  apellido: string;
  estado: string;
  descripcion: string;
  precio: number;
}

interface VerificarDatosProps {
  id_feria: number;
  fechaSeleccionada: string; // Nueva prop
}

const VerificarDatos: React.FC<VerificarDatosProps> = ({ id_feria, fechaSeleccionada }) => {
  const [feriantes, setFeriantes] = useState<Feriante[]>([]);
  const [menuActivo, setMenuActivo] = useState<number | null>(null);
  const [loadingFeriantes, setLoadingFeriantes] = useState<boolean>(false);
  const [errorFeriantes, setErrorFeriantes] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeriantes = async () => {
      try {
        setLoadingFeriantes(true);
        const response = await axios.get(
          `http://localhost:5000/api/supervisor/feriantes-activos/${id_feria}`,
          { params: { fecha_pago: fechaSeleccionada } }
        );
        setFeriantes(response.data);
        setErrorFeriantes(null);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Error al obtener la lista de feriantes.';
        setErrorFeriantes(message);
      } finally {
        setLoadingFeriantes(false);
      }
    };

    if (fechaSeleccionada) {
      fetchFeriantes();
    }
  }, [fechaSeleccionada, id_feria]);

  const toggleMenu = (id: number) => {
    setMenuActivo(menuActivo === id ? null : id);
  };

  return (
    <div>
      <h2>Verificación de Feriantes Activos</h2>
      <div>
        <h3>Feriantes Activos</h3>
        {loadingFeriantes ? (
          <p>Cargando feriantes...</p>
        ) : errorFeriantes ? (
          <p style={{ color: 'red' }}>{errorFeriantes}</p>
        ) : (
          <ul>
            {feriantes.map((feriante) => (
              <li key={feriante.id_user_fte}>
                <span
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => toggleMenu(feriante.id_user_fte)}
                >
                  {feriante.nombre} {feriante.apellido}
                </span>
                {menuActivo === feriante.id_user_fte && (
                  <div style={{ border: '1px solid #ddd', padding: '10px', marginTop: '5px' }}>
                    <p>Estado: {feriante.estado}</p>
                    <p>Nombre del puesto: {feriante.descripcion}</p>
                    <p>Precio: {feriante.precio}</p>
                    <RegistroCobrosFisicos id_feria={id_feria} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VerificarDatos;
