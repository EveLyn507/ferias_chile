import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Invitacion {
  id: number;
  nombre: string;
  ubicacion: string;
}

const InvitacionesFeria: React.FC = () => {
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);

  useEffect(() => {
    const fetchInvitaciones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/supervisor/invitaciones');
        setInvitaciones(response.data);
      } catch (error) {
        console.error('Error al obtener invitaciones:', error);
      }
    };

    fetchInvitaciones();
  }, []);

  const aceptarInvitacion = async (idInvitacion: number) => {
    try {
      await axios.post(`http://localhost:5000/api/supervisor/invitacion/${idInvitacion}/aceptar`);
      alert('Invitación aceptada');
      setInvitaciones(invitaciones.filter((invitacion) => invitacion.id !== idInvitacion));
    } catch (error) {
      console.error('Error al aceptar invitación:', error);
    }
  };

  return (
    <div>
      <h2>Invitaciones a Ferias</h2>
      <ul>
        {invitaciones.map((invitacion) => (
          <li key={invitacion.id}>
            Feria: {invitacion.nombre} - Ubicación: {invitacion.ubicacion}
            <button onClick={() => aceptarInvitacion(invitacion.id)}>Aceptar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvitacionesFeria;