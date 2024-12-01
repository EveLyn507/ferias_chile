import EstadoFeria from './EstadoFeria';
import GestionPuestos from './GestionPuestos';
import VerificarDatos from './VerificarDatos';
import RegistroCobrosFisicos from './RegistroCobrosFisicos';
import { Link } from 'react-router-dom';
import './Supervisor.css';

interface GestionSupervisorProps {
  id_feria: number;
  nombre_feria: string;
}

const GestionSupervisor = ({ id_feria, nombre_feria } : GestionSupervisorProps) => {

return (


  <div className="supervisor-container">
    <header className="supervisor-header">
      <h1>Panel de Supervisor</h1>
    </header>

    <section className="supervisor-section">
      <EstadoFeria id_feria={id_feria} />
    </section>

    <div className="supervisor-link">
      <Link to={`/feria/${id_feria}/${nombre_feria}/${"2024-11-22"}`} className="button">
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
  )
}

export default GestionSupervisor;
