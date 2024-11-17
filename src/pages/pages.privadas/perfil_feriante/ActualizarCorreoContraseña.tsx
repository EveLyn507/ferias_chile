import React, { useState, useEffect } from 'react';
import './feriante.css';


interface ActualizarCorreoContraseñaProps {
  correo: string;
  setCorreo: (correo: string) => void;
  setContraseña: (contraseña: string) => void;
  onCorreoActualizado: (nuevoCorreo: string) => void;
}

const ActualizarCorreoContraseña: React.FC<ActualizarCorreoContraseñaProps> = ({
  correo,
  setCorreo,
  setContraseña,
  onCorreoActualizado,
}) => {
  const [correoActualizado, setCorreoActualizado] = useState<string>(correo || ''); // Asegúrate de tener un valor inicial válido
  const [nuevaContraseña, setNuevaContraseña] = useState<string>(''); // Asegúrate de tener un valor inicial vacío
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    if (correo) {
      setCorreoActualizado(correo); // Sincroniza el valor de estado con el valor prop
    }
  }, [correo]);

  const validarCorreo = (correo: string): boolean => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return correoRegex.test(correo);
  };

  // Cuando se envía la solicitud para actualizar el correo
  const actualizarCorreo = async () => {
    setMensajeError(null);
    setMensajeExito(null);
    
    

     if (!correoActualizado || !correo) {
      setMensajeError('El correo actual y el nuevo correo son requeridos.');
      return;
    }
    

    if (!correoActualizado) {
      setMensajeError('El correo es requerido.');
      return;
    }

    if (!validarCorreo(correoActualizado)) {
      setMensajeError('El formato del correo no es válido.');
      return;
    }

   

    try {
      
      console.log({ correoActualizado, user_mail: correo });
      const response = await fetch('http://localhost:5000/api/actualizar-correo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoCorreo: correoActualizado,
          user_mail: correo, // Aquí debe ser el correo actual
        }),
      });

      if (response.ok) {
        const nuevoCorreo = correoActualizado;
        setCorreo(nuevoCorreo); // Actualiza el correo local
        onCorreoActualizado(nuevoCorreo); // Actualiza en el estado global
        localStorage.setItem('userEmail', nuevoCorreo); // Actualiza el almacenamiento local
        setMensajeExito('Correo actualizado con éxito.');
      } else {
        const errorData = await response.json();
        setMensajeError('Error al actualizar el correo: ' + errorData.message);
      }
    } catch (error) {
      setMensajeError('Error al conectar con el servidor: ' + error.message);
    }
  };

  const actualizarContraseña = async () => {
    setMensajeError(null);
    setMensajeExito(null);    

    if (!nuevaContraseña || !correo) {
      setMensajeError('La nueva contraseña y el correo son requeridos.');
      return;
    }

    if (nuevaContraseña.length < 8) {
      setMensajeError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      
      console.log({ nuevaContraseña, correo });
      const response = await fetch('http://localhost:5000/api/actualizar-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevaContraseña,
          userMail: correo,
        }),
      });

      if (response.ok) {
        setContraseña(nuevaContraseña);
        setMensajeExito('Contraseña actualizada con éxito.');
        setNuevaContraseña(''); 
      } else {
        const errorData = await response.json();
        setMensajeError('Error al actualizar la contraseña: ' + errorData.message);
      }
    } catch (error: any) {
      setMensajeError('Error al conectar con el servidor: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Actualizar Correo y Contraseña</h2>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}

      <div>
        <h3>Correo Actual</h3>
        <p>{correo}</p>

        <h3>Actualizar Correo</h3>
        <p>Nuevo correo: {correoActualizado}</p>
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
