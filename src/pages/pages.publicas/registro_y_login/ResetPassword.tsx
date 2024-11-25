import { useState } from 'react';
import axios from 'axios';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [message, setMessage] = useState('');

  const validarContrasena = (contrasena: string) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(contrasena);

  const handleResetPassword = async () => {
    if (nuevaContrasena !== confirmarContrasena) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (!validarContrasena(nuevaContrasena)) {
      setMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        email,
        nuevaContrasena,
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error al restablecer la contraseña', error);
      setMessage('Error al restablecer la contraseña');
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <input
        type="email"
        placeholder="Ingresa tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Nueva Contraseña"
        value={nuevaContrasena}
        onChange={(e) => setNuevaContrasena(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmar Contraseña"
        value={confirmarContrasena}
        onChange={(e) => setConfirmarContrasena(e.target.value)}
      />
      <button onClick={handleResetPassword}>Restablecer Contraseña</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
