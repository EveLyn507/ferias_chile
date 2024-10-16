
import  {  useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { createUser } from '../../../../redux/states/user';
import {  PrivateRoutes } from '../../../../models';


function LoginEncargado() {
  const [mail, setmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();


const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login1', { mail, contrasena });
      const {token , role, email} = response.data

      dispatch(createUser({ token , role , email}));
      navigate(`/${PrivateRoutes.PRIVATE + '/' + role}`, { replace: true });
    
    } catch (error) {
      console.error('Error de login', error);
      // Manejo de errores de login (puedes agregar lógica aquí)
    }
  };


  return (

    <>  
 
    <div>
      <h1>Login Encargado</h1>
      <input
        type="text"
        placeholder="Username"
        value={mail}
        onChange={(e) => setmail(e.target.value)}
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

export default LoginEncargado


