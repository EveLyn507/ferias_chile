import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FechaContrato {
  fecha_pago: string; // Ajustado al resultado esperado del backend
}

interface SeleccionarFechaProps {
  id_feria: number; // Se asegura que el tipo sea número
  onFechaSeleccionada: (fecha: string) => void; // Callback para pasar la fecha seleccionada
}

const SeleccionarFecha: React.FC<SeleccionarFechaProps> = ({ id_feria, onFechaSeleccionada }) => {
  const [fechas, setFechas] = useState<FechaContrato[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFechasContratos = async () => {
      try {
        setLoading(true); // Indica que la carga ha comenzado

        // Validación explícita del ID de la feria
        if (isNaN(Number(id_feria))) {
          throw new Error('El ID de la feria no es un número válido.');
        }

        // Llamada al backend
        const response = await axios.get(`http://localhost:5000/api/supervisor/fechas-contratos/${id_feria}`);

        // Verifica si hay datos disponibles
        if (response.data.length === 0) {
          setError('No se encontraron fechas de contratos para esta feria.');
        } else {
          setFechas(response.data); // Almacena las fechas en el estado
          setError(null); // Resetea cualquier error anterior
        }
      } catch (err: any) {
        const message = err.response?.data?.message || 'Error al cargar las fechas.';
        setError(message);
      } finally {
        setLoading(false); // Indica que la carga ha terminado
      }
    };

    fetchFechasContratos(); // Ejecuta la función de carga
  }, [id_feria]);

  return (
    <div>
      <h3>Selecciona una Fecha de Contrato</h3>
      {loading ? (
        <p>Cargando fechas...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <select
          onChange={(e) => onFechaSeleccionada(e.target.value)} // Maneja la selección de la fecha
          aria-label="Seleccionar fecha"
        >
          <option value="">Seleccione una fecha</option>
          {fechas.map((fecha, index) => (
            <option key={index} value={fecha.fecha_pago}>
              {fecha.fecha_pago}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SeleccionarFecha;
