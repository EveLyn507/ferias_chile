import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Feria {
  id_feria: number;
  nombre: string;
  nombre_comuna: string;
  nombre_region: string;
  estado_feria: string;
  puestos_ocupados: number;
  capacidad_total: number;
}

interface HorarioEmpleado {
  id_detalle_horario: number;
  id_dia: number;
  id_vacante: number;
  hora_entrada: string;
  hora_salida: string;
}

interface EstadoFeriaProps {
  id_feria: number;
}

const EstadoFeria: React.FC<EstadoFeriaProps> = ({ id_feria }) => {
  const [feria, setFeria] = useState<Feria | null>(null);
  const [horarios, setHorarios] = useState<HorarioEmpleado[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeriaEstado = async () => {
      try {
        if (!id_feria || isNaN(id_feria)) {
          throw new Error('ID de feria no válido');
        }

        const [feriaResponse, horariosResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/supervisor/estado-feria', { params: { id_feria } }),
          axios.get('http://localhost:5000/api/supervisor/obtener-horario', { params: { id_feria } }),
        ]);

        setFeria(feriaResponse.data[0]);
        const filteredHorarios = horariosResponse.data.flatMap((item: any) =>
          item.horario_empleado ? item.horario_empleado.map((horario: any) => ({
            id_detalle_horario: horario.id_detalle_horario,
            id_dia: horario.id_dia,
            id_vacante: horario.id_vacante,
            hora_entrada: horario.hora_entrada,
            hora_salida: horario.hora_salida,
          })) : []
        );
        setHorarios(filteredHorarios);

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchFeriaEstado();
  }, [id_feria]);

  if (loading) return <p>Cargando datos de la feria...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="estado-feria">
      <h2>Estado de Ocupación de la Feria</h2>
      {feria ? (
        <div>
          <h3>{feria.nombre}</h3>
          <p><strong>Comuna:</strong> {feria.nombre_comuna}</p>
          <p><strong>Región:</strong> {feria.nombre_region}</p>
          <p><strong>Estado:</strong> {feria.estado_feria}</p>
          <p><strong>Ocupación:</strong> {feria.puestos_ocupados}/{feria.capacidad_total} puestos ocupados</p>
        </div>
      ) : (
        <p>No se encontraron datos de la feria.</p>
      )}

      <h4>Horarios:</h4>
      {horarios.length > 0 ? (
        <ul>
          {horarios.map((horario, index) => (
            <li key={index}>
              Hora Entrada: {horario.hora_entrada} | Hora Salida: {horario.hora_salida}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay horarios disponibles para esta feria.</p>
      )}
    </div>
  );
};

export default EstadoFeria;
