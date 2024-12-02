import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@components/ToastService'; // Importar ToastService

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const { addToast } = useToast(); // Hook para manejar mensajes Toast

  const validarContrasena = (contrasena: string) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(contrasena);

  const handleResetPassword = async () => {
    if (nuevaContrasena !== confirmarContrasena) {
      addToast({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }

    if (!validarContrasena(nuevaContrasena)) {
      addToast({
        type: 'error',
        message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        email,
        nuevaContrasena,
      });

      addToast({ type: 'success', message: response.data.message });
    } catch (error) {
      console.error('Error al restablecer la contraseña', error);
      addToast({ type: 'error', message: 'Error al restablecer la contraseña' });
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
    </div>
  );
};

export default ResetPassword;
