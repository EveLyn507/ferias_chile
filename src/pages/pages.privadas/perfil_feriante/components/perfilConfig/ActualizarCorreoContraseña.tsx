import React, { useState, useEffect } from 'react';
import { useToast } from '@components/ToastService'; // Usando alias para importar ToastService

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
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  useEffect(() => {
    if (correo) {
      setCorreoActualizado(correo); // Sincroniza el valor de estado con el valor prop
    }
  }, [correo]);

  const validarCorreo = (correo: string): boolean => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return correoRegex.test(correo);
  };

  const actualizarCorreo = async () => {
    if (!correoActualizado || !correo) {
      addToast({ type: 'error', message: 'El correo actual y el nuevo correo son requeridos.' });
      return;
    }

    if (!validarCorreo(correoActualizado)) {
      addToast({ type: 'error', message: 'El formato del correo no es válido.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/actualizar-correo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoCorreo: correoActualizado, user_mail: correo }),
      });

      if (response.ok) {
        const nuevoCorreo = correoActualizado;
        setCorreo(nuevoCorreo);
        onCorreoActualizado(nuevoCorreo);
        localStorage.setItem('userEmail', nuevoCorreo);
        addToast({ type: 'success', message: 'Correo actualizado con éxito.' });
      } else {
        const errorData = await response.json();
        addToast({ type: 'error', message: `Error al actualizar el correo: ${errorData.message}` });
      }
    } catch (error) {
      addToast({ type: 'error', message: `Error al conectar con el servidor: ${error}` });
    }
  };

  const actualizarContraseña = async () => {
    if (!nuevaContraseña || !correo) {
      addToast({ type: 'error', message: 'La nueva contraseña y el correo son requeridos.' });
      return;
    }

    if (nuevaContraseña.length < 8) {
      addToast({
        type: 'error',
        message: 'La contraseña debe tener al menos 8 caracteres.',
      });
      return;
    }

    try {
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
        setNuevaContraseña('');
        addToast({ type: 'success', message: 'Contraseña actualizada con éxito.' });
      } else {
        const errorData = await response.json();
        addToast({
          type: 'error',
          message: `Error al actualizar la contraseña: ${errorData.message}`,
        });
      }
    } catch (error) {
      addToast({ type: 'error', message: `Error al conectar con el servidor: ${error}` });
    }
  };

  return (
    <div>
      <h2>Actualizar Correo y Contraseña</h2>

      <div>
        <h3>Correo Actual</h3>
        <p>{correo}</p>

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
