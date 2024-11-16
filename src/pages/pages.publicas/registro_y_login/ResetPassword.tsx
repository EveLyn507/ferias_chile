import { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
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
      const token = searchParams.get('token'); 

      if (!token) {
        setMessage('Token inválido o expirado.');
        return;
      }

      const response = await axios.post('http://localhost:5000/reset-password', {
        token,
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
