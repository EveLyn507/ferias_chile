import React, { useState } from 'react';
import axios from 'axios';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [error, setError] = useState('');

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', { email, contrasena });
      const token = response.data.token;
      localStorage.setItem('token', token); // Guardar el token en localStorage
      // Redirigir o realizar otra acción después de login exitoso
      console.log('Login exitoso', token);
    } catch (err) {
      setError('Error de login: Credenciales incorrectas');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={contrasena} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};




