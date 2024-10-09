/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearLocalStorage } from '../../../utilities/localStorage.utilities';
import { createUser, resetUser, UserKey } from '../../../redux/states/user';
import {  PrivateRoutes, PublicRoutes } from '../../../models';
import { Nav_bar } from '../../../components';

function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    clearLocalStorage(UserKey);
    dispatch(resetUser());
    navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
  }, []);



const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, contrasena });
      const {token , role } = response.data

      dispatch(createUser({ token , role}));
      navigate(`/${PrivateRoutes.PRIVATE}`, { replace: true });
    
    } catch (error) {
      console.error('Error de login', error);
      // Manejo de errores de login (puedes agregar lógica aquí)
    }
  };


  return (

    <>  
      <Nav_bar/> 
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
      <button onClick={login}>Login</button>
    </div>

    </>
  );
};

export default Login


