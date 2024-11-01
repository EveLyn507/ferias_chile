import React from 'react';
import EstadoFeria from './EstadoFeria';
import InvitacionesFeria from './InvitacionesFeria';
import GestionPuestos from './GestionPuestos';
import MapaFeria from './MapaFeria';

const GestionSupervisor: React.FC = () => {
  const idFeria = 1; // Ajusta el ID de la feria según sea necesario

  return (
    <div>
      <h1>Gestión de la Feria</h1>
      <EstadoFeria idFeria={idFeria} />
      <InvitacionesFeria />
      <GestionPuestos />
      <MapaFeria />
    </div>
  );
};

export default GestionSupervisor;
