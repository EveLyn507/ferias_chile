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

interface horario_empleado {
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
  const [horarios, setHorarios] = useState<horario_empleado[] | null>(null);

  useEffect(() => {
    const fetchFeriaEstado = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/supervisor/estado-feria', {
          params: { id_feria },
        });
        console.log('Datos de feria:', response.data); // Para verificar los datos
        setFeria(response.data[0]);
      } catch (error) {
        console.error('Error al obtener el estado de la feria:', error);
      }

      try {
        // Corrección: Acceder a la propiedad `horario_empleado` en la respuesta
        const response = await axios.get('http://localhost:5000/api/supervisor/obtener-horario', {
          params: { id_feria },  // Enviar id_feria como un parámetro de consulta
        });
        console.log('Datos completos de horarios:', response.data); // Verificar los datos completos

        // Filtrar solo los campos necesarios de `horario_empleado` en la respuesta
        const filteredHorarios = response.data.map((item: any) => {
          if (item.horario_empleado) {
            return item.horario_empleado.map((horario: any) => ({
              id_detalle_horario: horario.id_detalle_horario,
              id_dia: horario.id_dia,
              id_vacante: horario.id_vacante,
              hora_entrada: horario.hora_entrada,
              hora_salida: horario.hora_salida,
            }));
          }
          return []; // Si no hay `horario_empleado`, devolver un arreglo vacío
        }).flat(); // Usar `.flat()` para aplanar los arrays anidados

        setHorarios(filteredHorarios); // Almacenar los horarios filtrados
      } catch (error) {
        console.error('Error al obtener los Horarios:', error);
      }
    };

    fetchFeriaEstado();
  }, [id_feria]);

  return (
    <div>
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
        <p>Cargando datos de la feria...</p>
      )}

      <h4>Horarios:</h4>
      {horarios ? (
        <ul>
          {horarios.length > 0 ? (
            horarios.map((horario, index) => (
              <li key={index}>
                Hora Entrada: {horario.hora_entrada} | Hora Salida: {horario.hora_salida}
              </li>
            ))
          ) : (
            <p>No hay horarios disponibles para esta feria</p>
          )}
        </ul>
      ) : (
        <p>Cargando horarios...</p>
      )}
    </div>
  );
};

export default EstadoFeria;
