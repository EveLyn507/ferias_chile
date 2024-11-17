import React from 'react';
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

const GestionSupervisor: React.FC<GestionSupervisorProps> = ({ id_feria, nombre_feria }) => (
  <div>
    <h1>Panel de Supervisor</h1>
    <EstadoFeria id_feria={id_feria} />
    
    <div style={{ margin: '20px 0' }}>
      <Link to={`/feria/${id_feria}/${nombre_feria}`} className="button">
        Ver Feria
      </Link>
    </div>

    <GestionPuestos id_feria={id_feria} />
    <VerificarDatos id_feria={id_feria} />
    <RegistroCobrosFisicos id_feria={id_feria} />
    <Link to="/solicitudbaja">Solicitar Baja de Feria</Link>
  </div>
);

export default GestionSupervisor;
