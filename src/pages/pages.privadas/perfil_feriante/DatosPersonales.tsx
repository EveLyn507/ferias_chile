import React, { useState, useEffect } from 'react';

interface DatosPersonalesProps {
  nombre: string;
  apellido: string;
  telefono: string;
  setDatosPersonales: (datos: { nombre: string; apellido: string; telefono: string }) => void;
}

const DatosPersonales: React.FC<DatosPersonalesProps> = ({ nombre, apellido, telefono, setDatosPersonales }) => {
  const [nombreActualizado, setNombreActualizado] = useState<string>(nombre || ''); 
  const [apellidoActualizado, setApellidoActualizado] = useState<string>(apellido || '');  
  const [telefonoActualizado, setTelefonoActualizado] = useState<string>(telefono || '');  
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

    if (!apellidoActualizado.trim()) {
      setMensajeError('El apellido no puede estar vacío.');
      setMensajeExito(null);
      return;
    }

    if (!validarTelefono(telefonoActualizado)) {
      setMensajeError('El número de teléfono debe tener entre 8 y 15 dígitos.');
      setMensajeExito(null);
      return;
    }

    setDatosPersonales({
      nombre: nombreActualizado,
      apellido: apellidoActualizado,
      telefono: telefonoActualizado,
    });

    setMensajeExito('Datos actualizados con éxito.');
    setMensajeError(null);
  };

  useEffect(() => {
    setNombreActualizado(nombre || '');  
    setApellidoActualizado(apellido || '');  
    setTelefonoActualizado(telefono || '');  
  }, [nombre, apellido, telefono]);

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

      <label>Apellido:</label>
      <input
        type="text"
        value={apellidoActualizado}
        onChange={e => setApellidoActualizado(e.target.value)}
        placeholder="Escribe tu apellido"
      />
      
      <label>Teléfono:</label>
      <input
        type="text"
        value={telefonoActualizado}
        onChange={e => setTelefonoActualizado(e.target.value)}
        placeholder="Escribe tu teléfono"
      />
      
      <button onClick={actualizarDatos}>Actualizar Datos</button>
    </div>
  );
};

export default DatosPersonales;
