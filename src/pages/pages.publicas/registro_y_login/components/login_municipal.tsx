/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../../../redux/states/user';
import { PrivateRoutes } from '../../../../models';

const LoginMunicipal = () => {
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

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
      const { token, role, email, id_user } = response.data;
      const userData = { token, role, email, id_user };
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(createUser(userData));
      navigate(`/${PrivateRoutes.PRIVATE}/${role}`, { replace: true });
    } catch (error) {
      console.error('Error de login', error);
      setError('Credenciales incorrectas o error en el servidor.');
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginMunicipal;
