/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { createUser } from '../../../../redux/states/user';
import { PrivateRoutes } from '../../../../models';
import { useToast } from '@components/ToastService'; // Importar ToastService

function LoginFeriante() {
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { addToast } = useToast(); // Hook para manejar mensajes Toast
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

  const login = async () => {
    if (!mail || !contrasena) {
      addToast({ type: 'error', message: 'Correo y contraseña son requeridos.' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login2', { mail, contrasena });
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

  const handleGoogleSuccess = async (credentialResponse: { credential: any }) => {
    try {
      const { credential } = credentialResponse;
      if (!credential) {
        throw new Error('El token de Google es inválido o está vacío.');
      }

      const googleResponse = await axios.post('http://localhost:5000/registro/google', { credential });
      const { token, role, email, id_user } = googleResponse.data;
      const userData = { token, role, email, id_user };
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(createUser(userData));
      addToast({ type: 'success', message: 'Inicio de sesión con Google exitoso.' });
      navigate(`/${PrivateRoutes.PRIVATE}/${role}`, { replace: true });
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        console.error('El usuario ya está registrado. Iniciando sesión automáticamente.');
        const { token, role, email, id_user } = error.response.data;
        const userData = { token, role, email, id_user };
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch(createUser(userData));
        addToast({ type: 'info', message: 'Usuario registrado previamente. Inicio de sesión exitoso.' });
        navigate(`/${PrivateRoutes.PRIVATE}/${role}`, { replace: true });
      } else {
        console.error('Error al intentar autenticar con Google', error);
        addToast({ type: 'error', message: 'Error al intentar autenticar con Google.' });
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
        <button onClick={login}>Iniciar Sesión</button>

        <h2>O inicia sesión con Google</h2>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.error('Google Auth Failed');
            addToast({ type: 'error', message: 'Autenticación de Google fallida.' });
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginFeriante;
