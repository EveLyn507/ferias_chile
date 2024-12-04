import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoFeria from './EstadoFeria';
import GestionPuestos from './GestionPuestos';
import VerificarDatos from './VerificarDatos';
import RegistroCobrosFisicos from './RegistroCobrosFisicos';
import './Supervisor.css';

interface GestionSupervisorProps {
  id_feria: number;
  nombre_feria: string;
}

const GestionSupervisor = ({ id_feria, nombre_feria }: GestionSupervisorProps) => {
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);
  const [selectedFecha, setSelectedFecha] = useState<string>('');
  const [loadingFechas, setLoadingFechas] = useState<boolean>(true);
  const [errorFechas, setErrorFechas] = useState<string | null>(null);

  // Obtener las fechas disponibles
  useEffect(() => {
    const fetchFechas = async () => {
      try {
        setLoadingFechas(true);
        const response = await fetch(`http://localhost:5000/api/supervisor/fechas-mapas/${id_feria}/fechas`);
        console.log('Solicitando fechas desde:', `/fechas-mapas/${id_feria}/fechas`);

        if (response.ok) {
          const data = await response.json();
          console.log('Fechas obtenidas:', data);
          const fechas = data.map((item: { fecha: string }) => item.fecha);
          setFechasDisponibles(fechas);
          setSelectedFecha(fechas[0] || ''); // Seleccionar la primera fecha por defecto
          setErrorFechas(null);
        } else {
          throw new Error('Error al obtener fechas. Respuesta no OK.');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        setErrorFechas('No se pudieron cargar las fechas.');
      } finally {
        setLoadingFechas(false);
      }
    };
    fetchFechas();
  }, [id_feria]);

  const handleFechaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFecha(event.target.value);
  };

  return (
    <div className="supervisor-container">
      <header className="supervisor-header">
        <h1>Panel de Supervisor</h1>
      </header>

      <section className="supervisor-section">
        <EstadoFeria id_feria={id_feria} />
      </section>

      {/* Dropdown para seleccionar la fecha */}
      <div className="supervisor-dropdown">
        <label htmlFor="fecha">Seleccionar Fecha: </label>
        {loadingFechas ? (
          <p>Cargando fechas...</p>
        ) : errorFechas ? (
          <p style={{ color: 'red' }}>{errorFechas}</p>
        ) : (
          <select id="fecha" value={selectedFecha} onChange={handleFechaChange}>
            {fechasDisponibles.map((fecha) => (
              <option key={fecha} value={fecha}>
                {fecha}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Link que incluye la fecha seleccionada */}
      <div className="supervisor-link">
        <Link to={`/feria/${id_feria}/${nombre_feria}/${selectedFecha}`} className="button">
          Ver Feria
        </Link>
      </div>

      <section className="supervisor-section">
        <GestionPuestos id_feria={id_feria} />
      </section>

      <section className="supervisor-section">
        <VerificarDatos id_feria={id_feria} />
      </section>

      <section className="supervisor-section">
        <RegistroCobrosFisicos id_feria={id_feria} />
      </section>

      <div className="supervisor-link">
        <Link to="/solicitudbaja" className="button secondary">
          Solicitar Baja de Feria
        </Link>
      </div>
    </div>
  );
};

export default GestionSupervisor;
