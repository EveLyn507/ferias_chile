import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../redux/store';

interface DatosPersonalesProps {
  userMail: string;
  nombre: string;
  apellido: string;
  telefono: string;
  setDatosPersonales: (datos: { nombre: string; apellido: string; telefono: string }) => void;
}

const DatosPersonales: React.FC<DatosPersonalesProps> = ({  nombre, apellido, telefono, setDatosPersonales }) => {
  const userMail = useSelector((state: AppStore) => state.user.email);
  const id_user = useSelector((state: AppStore) => state.user.id_user);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatosPersonales = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cargar-datos-personales/${id_user}`);
        if (response.ok) {
          const data = await response.json();
          setDatosPersonales({ nombre: data.nombre, apellido: data.apellido, telefono: data.telefono });
        } else {
          console.error('Error al cargar datos personales');
        }
      } catch (error) {
        console.error('Error al cargar datos personales:', error);
      }
    };

    if (id_user) { 
      cargarDatosPersonales();
    }
  }, [id_user, setDatosPersonales]);

  const actualizarDatos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/actualizar-datos-personales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_user, nombre, apellido, telefono }),
      });

      if (response.ok) {
        setMensajeExito('Datos actualizados con éxito.');
      } else {
        setMensajeError('Error al actualizar los datos.');
      }
    } catch (error) {
      setMensajeError('Error al conectar con el servidor.');
    }
  };

  

  return (
    <div>
      <h2>Datos Personales</h2>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}

      <label>Nombre:</label>
      <input type="text" value={nombre} onChange={(e) => setDatosPersonales({ nombre: e.target.value, apellido, telefono })} />
      
      <label>Apellido:</label>
      <input type="text" value={apellido} onChange={(e) => setDatosPersonales({ nombre, apellido: e.target.value, telefono })} />
      
      <label>Teléfono:</label>
      <input type="text" value={telefono} onChange={(e) => setDatosPersonales({ nombre, apellido, telefono: e.target.value })} />
      
      <button onClick={actualizarDatos}>Actualizar Datos</button>
    </div>
  );
};

export default DatosPersonales;
