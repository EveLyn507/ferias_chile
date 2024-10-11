import { useState, useEffect } from 'react';

interface Feria {
  id: number;
  nombre: string;
  fecha: string;
  estado: 'completada' | 'pendiente' | 'cancelada';
}

const feriasEjemplo: Feria[] = [
  { id: 1, nombre: 'Feria de Verano', fecha: '15-08-2023', estado: 'completada' },
  { id: 2, nombre: 'Feria de Invierno', fecha: '10-12-2023', estado: 'pendiente' },
  { id: 3, nombre: 'Feria de Primavera', fecha: '20-05-2023', estado: 'cancelada' },
  { id: 4, nombre: 'Feria de Otoño', fecha: '01-10-2022', estado: 'completada' },
];

const HistorialActividades: React.FC = () => {
  const [historial, setHistorial] = useState<Feria[]>([]);

  useEffect(() => {
    const historialFiltrado = feriasEjemplo.filter(
      feria => feria.estado !== 'cancelada' && feria.estado === 'completada'
    );
    setHistorial(historialFiltrado);
  }, []);

  return (
    <div>
      <h2>Historial de Actividades</h2>
      {historial.length > 0 ? (
        <ul>
          {historial.map(feria => (
            <li key={feria.id}>
              <strong>{feria.nombre}</strong> - {feria.fecha}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay ferias completadas en el historial.</p>
      )}
    </div>
  );
};

export default HistorialActividades;

