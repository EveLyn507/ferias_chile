// GestionSupervisor.tsx
import React from 'react';
import EstadoFeria from './EstadoFeria';
import GestionPuestos from './GestionPuestos';
import MapaFeria from './MapaFeria';
import VerificarDatos from './VerificarDatos';
import RegistroCobrosFisicos from './RegistroCobrosFisicos';
import { Link } from 'react-router-dom';

interface GestionSupervisorProps {
  id_feria: number;
}

const GestionSupervisor: React.FC<GestionSupervisorProps> = ({ id_feria }) => (
  <div>
    <h1>Panel de Supervisor</h1>
    <EstadoFeria id_feria={id_feria} />
    <MapaFeria id_feria={id_feria} />
    <GestionPuestos id_feria={id_feria} />
    <VerificarDatos id_feria={id_feria} />
    <RegistroCobrosFisicos id_feria={id_feria} />
    <Link to="/solicitudbaja">Solicitar Baja de Feria</Link>
  </div>
);

export default GestionSupervisor;
