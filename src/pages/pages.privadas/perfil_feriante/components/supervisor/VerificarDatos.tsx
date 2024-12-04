import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FechaContrato {
  fecha: string; // Ajustado al resultado esperado del backend
}

interface Feriante {
  id_user_fte: number;
  nombre: string;
  apellido: string;
  estado: string;
}

interface VerificarDatosProps {
  id_feria: number;
}

const VerificarDatosCombinado: React.FC<VerificarDatosProps> = ({ id_feria }) => {
  const [fechas, setFechas] = useState<FechaContrato[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [feriantes, setFeriantes] = useState<Feriante[]>([]);
  const [loadingFechas, setLoadingFechas] = useState<boolean>(true);
  const [loadingFeriantes, setLoadingFeriantes] = useState<boolean>(false);
  const [errorFechas, setErrorFechas] = useState<string | null>(null);
  const [errorFeriantes, setErrorFeriantes] = useState<string | null>(null);

  // Obtener fechas de contratos
  useEffect(() => {
    const fetchFechasContratos = async () => {
      try {
        setLoadingFechas(true);

        // Validación explícita del ID de feria
        if (isNaN(Number(id_feria))) {
          throw new Error('El ID de la feria no es un número válido.');
        }

        const response = await axios.get(`http://localhost:5000/api/supervisor/fechas-contratos/${id_feria}`);

        if (response.data.length === 0) {
          setErrorFechas('No se encontraron fechas de contratos para esta feria.');
        } else {
          setFechas(response.data);
          setErrorFechas(null);
        }
      } catch (err: any) {
        const message = err.response?.data?.message || 'Error al cargar las fechas.';
        setErrorFechas(message);
      } finally {
        setLoadingFechas(false);
      }
    };

    fetchFechasContratos();
  }, [id_feria]);

  // Obtener feriantes activos según la fecha seleccionada
  useEffect(() => {
    const fetchFeriantes = async (fecha: string) => {
      try {
        setLoadingFeriantes(true);

        const response = await axios.get(`http://localhost:5000/api/supervisor/feriantes-activos/${id_feria}`, {
          params: { fecha_pago: fecha },
        });

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
      fetchFeriantes(fechaSeleccionada);
    }
  }, [fechaSeleccionada, id_feria]);

  return (
    <div>
      <h2>Verificación de Feriantes Activos</h2>

      {/* Selección de fechas */}
      <div>
        <h3>Selecciona una Fecha de Contrato</h3>
        {loadingFechas ? (
          <p>Cargando fechas...</p>
        ) : errorFechas ? (
          <p style={{ color: 'red' }}>{errorFechas}</p>
        ) : (
          <select
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            aria-label="Seleccionar fecha"
          >
            <option value="">Seleccione una fecha</option>
            {fechas.map((fecha, index) => (
              <option key={index} value={fecha.fecha}>
                {fecha.fecha}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Lista de feriantes */}
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
                {feriante.nombre} {feriante.apellido} - Estado: {feriante.estado}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VerificarDatosCombinado;
