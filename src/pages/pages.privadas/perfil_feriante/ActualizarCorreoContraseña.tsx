import React, { useState } from 'react';

interface ActualizarCorreoContraseñaProps {
  correo: string;
  setCorreo: (correo: string) => void;
  setContraseña: (contraseña: string) => void;
}

const ActualizarCorreoContraseña: React.FC<ActualizarCorreoContraseñaProps> = ({
  correo,
  setCorreo,
  setContraseña,
}) => {
  const [correoActualizado, setCorreoActualizado] = useState(correo);
  const [nuevaContraseña, setNuevaContraseña] = useState('');

  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);



  const validarCorreo = (correo: string): boolean => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return correoRegex.test(correo);
  };

  const actualizarCorreo = async () => {
    setMensajeError(null);
    setMensajeExito(null);
  
    if (!correoActualizado) {
      setMensajeError('El correo es requerido.');
      return;
    }
  
    if (!validarCorreo(correoActualizado)) {
      setMensajeError('El formato del correo no es válido.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/actualizar-correo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: correoActualizado, userMail: correo }), 
      });
  
      if (response.ok) {
        setCorreo(correoActualizado); 
        setMensajeExito('Correo actualizado con éxito.');
        setCorreoActualizado(''); 
      } else {
        throw new Error('Error al actualizar el correo');
      }
    } catch (error) {
      setMensajeError('Error al actualizar el correo: ' + error.message);
    }
  };
  
  const actualizarContraseña = async () => {
    setMensajeError(null);
    setMensajeExito(null);
  
    if (!nuevaContraseña) {
      setMensajeError('La nueva contraseña es requerida.');
      return;
    }
  
    if (nuevaContraseña.length < 8) {
      setMensajeError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/actualizar-contraseña', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevaContraseña, userMail: correo }), 
      });
  
      if (response.ok) {
        setContraseña(nuevaContraseña); 
        setMensajeExito('Contraseña actualizada con éxito.');
        setNuevaContraseña(''); 
      } else {
        throw new Error('Error al actualizar la contraseña');
      }
    } catch (error) {
      setMensajeError('Error al actualizar la contraseña: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Actualizar Correo y Contraseña</h2>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}

      <div>
        <h3>Actualizar Correo</h3>
        <input
          type="email"
          value={correoActualizado}
          onChange={(e) => setCorreoActualizado(e.target.value)}
          placeholder="Escribe tu nuevo correo electrónico"
        />
        <button onClick={actualizarCorreo}>Actualizar Correo</button>
      </div>

      <div>
        <h3>Actualizar Contraseña</h3>
        <input
          type="password"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          placeholder="Escribe tu nueva contraseña"
        />
        <button onClick={actualizarContraseña}>Actualizar Contraseña</button>
      </div>
    </div>
  );
};

export default ActualizarCorreoContraseña;
