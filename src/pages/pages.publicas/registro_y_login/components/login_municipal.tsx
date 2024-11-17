import { useState } from 'react';
import axios from 'axios';

const LoginMunicipal = () => {
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const validarMail = (mail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  const handleLogin = async () => {
    setError('');

    if (!validarMail(mail)) {
      setError('El correo no tiene un formato válido.');
      return;
    }

    if (!contrasena) {
      setError('La contraseña no puede estar vacía.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login3', { mail, contrasena });
      console.log('Login exitoso:', response.data);
    } catch (error) {
      console.error('Error de login:', error);
      setError('Credenciales incorrectas o error en el servidor.');
    }
  };

  return (
    <div>
      <h1>Login Municipal</h1>
      <input
        type="text"
        placeholder="Correo Electrónico"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar Sesión</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginMunicipal;
