
import { useState } from 'react';
import axios from 'axios';

export const Recuperacion = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRecuperacion = async () => {
    try {
      const response = await axios.post('http://localhost:5000/recuperacion', { email });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error al solicitar recuperación', error);
      setMessage('Error al enviar el correo de recuperación');
    }
  };

  return (
    <div>
      <h2>Recuperación de Contraseña</h2>
      <input
        type="email"
        placeholder="Ingresa tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRecuperacion}>Enviar Enlace de Recuperación</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Recuperacion;