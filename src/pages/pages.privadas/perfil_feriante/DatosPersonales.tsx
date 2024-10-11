import React, { useState } from 'react';

interface DatosPersonalesProps {
  nombre: string;
  telefono: string;
  direccion: string;
  setDatosPersonales: (datos: { nombre: string; telefono: string; direccion: string }) => void;
}

const DatosPersonales: React.FC<DatosPersonalesProps> = ({ nombre, telefono, direccion, setDatosPersonales }) => {
  const [nombreActualizado, setNombreActualizado] = useState(nombre);
  const [telefonoActualizado, setTelefonoActualizado] = useState(telefono);
  const [direccionActualizada, setDireccionActualizada] = useState(direccion);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const validarTelefono = (telefono: string): boolean => {
    const telefonoRegex = /^[0-9]{8,15}$/; 
    return telefonoRegex.test(telefono);
  };


  const actualizarDatos = () => {

    if (!nombreActualizado.trim()) {
      setMensajeError('El nombre no puede estar vacío.');
      setMensajeExito(null);
      return;
    }

    if (!validarTelefono(telefonoActualizado)) {
      setMensajeError('El número de teléfono debe tener entre 8 y 15 dígitos.');
      setMensajeExito(null);
      return;
    }

    if (!direccionActualizada.trim()) {
      setMensajeError('La dirección no puede estar vacía.');
      setMensajeExito(null);
      return;
    }

    setDatosPersonales({
      nombre: nombreActualizado,
      telefono: telefonoActualizado,
      direccion: direccionActualizada,
    });

    setMensajeExito('Datos actualizados con éxito.');
    setMensajeError(null);
  };

  return (
    <div>
      <h2>Datos Personales</h2>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
      
      <label>Nombre:</label>
      <input
        type="text"
        value={nombreActualizado}
        onChange={e => setNombreActualizado(e.target.value)}
        placeholder="Escribe tu nombre"
      />
      
      <label>Teléfono:</label>
      <input
        type="text"
        value={telefonoActualizado}
        onChange={e => setTelefonoActualizado(e.target.value)}
        placeholder="Escribe tu teléfono"
      />
      
      <label>Dirección:</label>
      <input
        type="text"
        value={direccionActualizada}
        onChange={e => setDireccionActualizada(e.target.value)}
        placeholder="Escribe tu dirección"
      />
      
      <button onClick={actualizarDatos}>Actualizar Datos</button>
    </div>
  );
};

export default DatosPersonales;
