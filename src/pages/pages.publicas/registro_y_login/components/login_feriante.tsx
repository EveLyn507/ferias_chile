// login_feriante.tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // npm install @react-oauth/google
import { createUser } from '../../../../redux/states/user';
import { PrivateRoutes } from '../../../../models';

function LoginFeriante() {
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login2', { mail, contrasena });
      const { token, role, email, id_user } = response.data;
      console.log(id_user)

      dispatch(createUser({ token, role, email, id_user }));
      navigate(`/${PrivateRoutes.PRIVATE + '/' + role}`, { replace: true });
    } catch (error) {
      console.error('Error de login', error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleResponse = await axios.post('http://localhost:5000/registro/google', {
        credential: credentialResponse.credential,
      });

      const { token, role, email } = googleResponse.data;
      dispatch(createUser({ token, role, email }));
      navigate(`/${PrivateRoutes.PRIVATE + '/' + role}`, { replace: true });
    } catch (error) {
      console.error('Error al registrar con Google', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div>
        <h1>Login Feriante</h1>
        <input
          type="text"
          placeholder="Username"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <button onClick={login}>Login</button>

        <h2>O regístrate con Google</h2>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.error('Google Auth Failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginFeriante;
