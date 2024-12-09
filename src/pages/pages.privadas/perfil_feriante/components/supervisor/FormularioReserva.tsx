import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ReservaPuesto: React.FC = () => {
  const location = useLocation();
  const { id_puesto } = location.state || {}; // Recibir id_puesto desde la navegación

  const [usuarioFisico, setUsuarioFisico] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Verificación si el id_puesto es undefined
  if (!id_puesto) {
    return <p>Error: No se ha recibido el ID del puesto.</p>;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Asegúrate de que todos los valores sean correctos
    if (!id_puesto || !usuarioFisico) {
      setMensaje('Faltan datos esenciales, por favor revise.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/supervisor/insert', {
        usuario_fisico: usuarioFisico,
        id_arriendo_puesto: id_puesto,
      });

      setMensaje(`Contrato creado con ID: ${response.data.id_contrato}`);
      setUsuarioFisico('');
    } catch (error) {
      console.error('Error al crear el contrato:', error);
      setMensaje('Error al crear el contrato. Intente nuevamente.');
    }
  };

  return (
    <div className="reserva-puesto-container">
      <form onSubmit={handleSubmit} className="reserva-puesto-form">
        <h2>Reservar Puesto</h2>
        <div>
          <label>ID Puesto:</label>
          <p>{id_puesto}</p>
        </div>
        <div>
          <label>Usuario Físico:</label>
          <input
            type="text"
            value={usuarioFisico}
            onChange={(e) => setUsuarioFisico(e.target.value)}
            required
          />
        </div>
        <button type="submit">Confirmar Reserva</button>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
};

export default ReservaPuesto;
