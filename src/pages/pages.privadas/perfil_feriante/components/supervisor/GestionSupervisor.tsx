import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EstadoFeria from './EstadoFeria';
import GestionPuestos from './GestionPuestos';
import VerificarDatos from './VerificarDatos';
import './Supervisor.css';
import PuestosTable from './PuestosTable';

interface GestionSupervisorProps {
  id_feria: number;
  nombre_feria: string;
}

const GestionSupervisor = ({ id_feria, nombre_feria }: GestionSupervisorProps) => {
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);
  const [selectedFecha, setSelectedFecha] = useState<string>('');
  const [loadingFechas, setLoadingFechas] = useState<boolean>(true);
  const [errorFechas, setErrorFechas] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFechas = async () => {
      try {
        setLoadingFechas(true);
        const response = await fetch(`http://localhost:5000/api/supervisor/fechas-mapas/${id_feria}/fechas`);
        if (response.ok) {
          const data = await response.json();
          const fechas = data.map((item: { fecha: string }) => item.fecha);
          setFechasDisponibles(fechas);
          setSelectedFecha(fechas[0] || ''); // Selecciona la primera fecha por defecto
          setErrorFechas(null);
        } else {
          throw new Error('Error al obtener fechas.');
        }
      } catch (error) {
        setErrorFechas('No se pudieron cargar las fechas.' + error);
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
    <>
    {selectedFecha ? (
      <div className="supervisor-container">
      <header className="supervisor-header">
        <h1>Panel de Supervisor</h1>
      </header>

      <section className="supervisor-section">
        <EstadoFeria id_feria={id_feria} />
      </section>

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
      {
        
      }
      <div className="supervisor-link">
      <button onClick={() => navigate(`2/supervisor/${id_feria}/${nombre_feria}/${selectedFecha}`)} className="button">
  Ver Feria
</button>
      </div>
      
      <section className="supervisor-section">
        <VerificarDatos id_feria={id_feria} fechaSeleccionada={selectedFecha} />
      </section>

      <section className="supervisor-section">
        <PuestosTable id_feria={id_feria}  fecha={selectedFecha}/>
      </section>  

      <section className="supervisor-section">
        <GestionPuestos id_feria={id_feria} fecha={selectedFecha} />
      </section>
    </div>
    ) : (<span> cargaondo....</span>)
    }

        </>
  );
};

export default GestionSupervisor;
