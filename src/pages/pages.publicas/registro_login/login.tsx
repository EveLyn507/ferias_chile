import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux/states/user';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, contrasena });
      const { token, role } = response.data;

      // Dispatch para actualizar el estado de Redux con el token y el rol
      dispatch(loginSuccess({ token, role }));

      // Redirigir al perfil correspondiente
      if (role === 'encargado') {
        navigate(`/private/Perfil-E`);
      } else if (role === 'feriante') {
        navigate(`/private/Perfil-F`);
      } else if (role === 'administrador') {
        navigate(`/private/Perfil-A`);
      } else {
        // Si el rol no coincide, redirigir a una página genérica o de error
        navigate(`/not-authorized`);
      }
    } catch (error) {
      console.error('Error de login', error);
      // Manejo de errores de login (puedes agregar lógica aquí)
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};


