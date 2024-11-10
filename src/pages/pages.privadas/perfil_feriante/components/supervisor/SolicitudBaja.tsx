import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SolicitudBaja: React.FC = () => {
  const [razon, setRazon] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const enviarSolicitudBaja = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/supervisor/solicitud-baja', { razon });
      if (response.data.exito) {
        alert('Solicitud de baja enviada con éxito.');
        navigate('/gestionsupervisor');
      } else {
        setError(response.data.mensaje);
      }
    } catch (error) {
      setError('Error al enviar la solicitud de baja.');
    }
  };

  return (
    <div>
      <h2>Solicitud de Baja de Feria</h2>
      <p>Si deseas retirarte de la feria, puedes enviar una solicitud de baja.</p>
      <textarea
        value={razon}
        onChange={(e) => setRazon(e.target.value)}
        placeholder="Razón (opcional)"
        rows={4}
        style={{ width: '100%' }}
      ></textarea>
      <button onClick={enviarSolicitudBaja}>Enviar Solicitud de Baja</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SolicitudBaja;