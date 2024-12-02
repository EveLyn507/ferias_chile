/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PrivateRoutes } from '../../../../models';
import { createUser } from '../../../../redux/states/user';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useToast } from '@components/ToastService'; // Importar ToastService

const LoginEncargado = () => {
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  const validarMail = (mail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { token, role } = JSON.parse(storedUser);
      dispatch(createUser(JSON.parse(storedUser)));
      navigate(`/${PrivateRoutes.PRIVATE}/${role}`, { replace: true });
    }
  }, [dispatch, navigate]);

  const handleLogin = async () => {
    if (!validarMail(mail)) {
      addToast({ type: 'error', message: 'El correo no tiene un formato válido.' });
      return;
    }

    if (!contrasena) {
      addToast({ type: 'error', message: 'La contraseña no puede estar vacía.' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login1', { mail, contrasena });
      const { token, role, email, id_user } = response.data;
      const userData = { token, role, email, id_user };
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(createUser(userData));
      addToast({ type: 'success', message: 'Inicio de sesión exitoso.' });
      navigate(`/${PrivateRoutes.PRIVATE}/${role}`, { replace: true });
    } catch (error) {
      console.error('Error de login', error);
      addToast({ type: 'error', message: 'Credenciales incorrectas o error en el servidor.' });
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default LoginEncargado;
