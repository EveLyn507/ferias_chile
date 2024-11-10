// EstadoFeria.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Feria {
  id_feria: number;
  nombre: string;
  comuna: string;
  region: string;
  estado: string;
  puestos_ocupados: number;
  capacidad_total: number;
  horarios?: { // Hacemos que horarios sea opcional para evitar errores si no existe
    dia: string;
    hora_inicio: string;
    hora_termino: string;
    id_dia_armado: number;
    hora_inicio_armado: string;
    hora_termino_armado: string;
  }[];
}

interface EstadoFeriaProps {
  id_feria: number;
}

const EstadoFeria: React.FC<EstadoFeriaProps> = ({ id_feria }) => {
  const [feria, setFeria] = useState<Feria | null>(null);

  useEffect(() => {
    const fetchFeriaEstado = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/supervisor/estado-feria', {
          params: { id_feria },
        });
        setFeria(response.data[0]);
      } catch (error) {
        console.error('Error al obtener el estado de la feria:', error);
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
          <p>Comuna: {feria.comuna}</p>
          <p>Región: {feria.region}</p>
          <p>Estado: {feria.estado}</p>
          <p>Ocupación: {feria.puestos_ocupados}/{feria.capacidad_total} puestos ocupados</p>
          
          <h4>Horarios:</h4>
          <ul>
            {feria.horarios && feria.horarios.length > 0 ? (
              feria.horarios.map((horario, index) => (
                <li key={index}>
                  Día: {horario.dia} | Hora Inicio: {horario.hora_inicio} | Hora Término: {horario.hora_termino} <br />
                  Día Armado: {horario.id_dia_armado} | Inicio Armado: {horario.hora_inicio_armado} | Fin Armado: {horario.hora_termino_armado}
                </li>
              ))
            ) : (
              <p>No hay horarios disponibles para esta feria</p>
            )}
          </ul>
        </div>
      ) : (
        <p>Cargando datos de la feria...</p>
      )}
    </div>
  );
};

export default EstadoFeria;
