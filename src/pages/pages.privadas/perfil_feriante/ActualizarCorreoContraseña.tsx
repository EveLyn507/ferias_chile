import React, { useState } from 'react';

interface ActualizarCorreoContraseñaProps {
  correo: string;
  setCorreo: (correo: string) => void;
  setContraseña: (contraseña: string) => void;
}

const ActualizarCorreoContraseña: React.FC<ActualizarCorreoContraseñaProps> = ({ correo, setCorreo, setContraseña }) => {
  const [correoActualizado, setCorreoActualizado] = useState(correo);
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');

  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const validarCorreo = (correo: string): boolean => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return correoRegex.test(correo);
  };

  const validarContraseña = (contraseña: string): boolean => {
    return contraseña.length >= 8 && /[A-Z]/.test(contraseña) && /[0-9]/.test(contraseña);
  };

  const actualizarCorreo = () => {
    if (!validarCorreo(correoActualizado)) {
      setMensajeError('El correo electrónico no es válido.');
      setMensajeExito(null);
      return;
    }

    setCorreo(correoActualizado);
    setMensajeExito('Correo actualizado con éxito.');
    setMensajeError(null);
  };

  const actualizarContraseña = () => {
    if (nuevaContraseña !== confirmarContraseña) {
      setMensajeError('Las contraseñas no coinciden.');
      setMensajeExito(null);
      return;
    }

    if (!validarContraseña(nuevaContraseña)) {
      setMensajeError('La nueva contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
      setMensajeExito(null);
      return;
    }

    setContraseña(nuevaContraseña);
    setMensajeExito('Contraseña actualizada con éxito.');
    setMensajeError(null);
  };

  return (
    <div>
      <h2>Actualizar Correo y Contraseña</h2>

      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}

      <div>
        <h3>Actualizar Correo</h3>
        <label>Correo Electrónico:</label>
        <input
          type="email"
          value={correoActualizado}
          onChange={e => setCorreoActualizado(e.target.value)}
          placeholder="Escribe tu correo electrónico"
        />
        <button onClick={actualizarCorreo}>Actualizar Correo</button>
      </div>

      <div>
        <h3>Actualizar Contraseña</h3>
        <label>Contraseña Actual:</label>
        <input
          type="password"
          value={contraseñaActual}
          onChange={e => setContraseñaActual(e.target.value)}
          placeholder="Escribe tu contraseña actual"
        />
        
        <label>Nueva Contraseña:</label>
        <input
          type="password"
          value={nuevaContraseña}
          onChange={e => setNuevaContraseña(e.target.value)}
          placeholder="Escribe tu nueva contraseña"
        />

        <label>Confirmar Nueva Contraseña:</label>
        <input
          type="password"
          value={confirmarContraseña}
          onChange={e => setConfirmarContraseña(e.target.value)}
          placeholder="Confirma tu nueva contraseña"
        />

        <button onClick={actualizarContraseña}>Actualizar Contraseña</button>
      </div>
    </div>
  );
};

export default ActualizarCorreoContraseña;
