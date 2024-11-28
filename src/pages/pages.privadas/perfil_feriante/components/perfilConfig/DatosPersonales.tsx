import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AppStore } from '../../../../../redux/store';

interface DatosPersonalesProps {
  userMail: string;
  nombre: string;
  apellido: string;
  telefono: string;
  setDatosPersonales: (datos: { nombre: string; apellido: string; telefono: string }) => void;
}

const DatosPersonales: React.FC<DatosPersonalesProps> = ({ nombre, apellido, telefono, setDatosPersonales }) => {
  const id_user = useSelector((state: AppStore) => state.user.id_user);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [datosLocales, setDatosLocales] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
  });

  // Validar teléfono
  const validarTelefono = (telefono: string): boolean => /^[0-9]{7,15}$/.test(telefono);

  // Sincronizar datos iniciales cuando se cargan
  useEffect(() => {
    setDatosLocales({
      nombre,
      apellido,
      telefono,
    });
  }, [nombre, apellido, telefono]);

  // Cargar datos personales
  useEffect(() => {
    const cargarDatosPersonales = async () => {
      console.log('Enviando solicitud para cargar datos personales');
      console.log('ID de usuario:', id_user);

      try {
        const response = await axios.get(`http://localhost:5000/api/cargar-datos-personales/${id_user}`);
        console.log('Datos recibidos del servidor:', response.data);

        setDatosPersonales({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          telefono: response.data.telefono,
        });
      } catch (error) {
        console.error('Error al cargar datos personales:', error);
        setMensajeError('Error al cargar datos personales.');
      }
    };

    if (id_user) {
      cargarDatosPersonales();
    } else {
      console.error('ID de usuario no definido');
    }
    // Solo depende de id_user para evitar múltiples llamadas
  }, [id_user]);

  // Manejar cambios en el formulario
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosLocales({
      ...datosLocales,
      [name]: value,
    });
  };

  // Actualizar datos personales
  const actualizarDatos = async () => {
    setMensajeError(null);
    setMensajeExito(null);

    const { nombre, apellido, telefono } = datosLocales;

    if (!nombre || !apellido || !telefono) {
      setMensajeError('Todos los campos son obligatorios.');
      return;
    }

    if (!validarTelefono(telefono)) {
      setMensajeError('El teléfono debe tener entre 7 y 15 dígitos.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/actualizar-datos-personales', {
        id_user,
        nombre,
        apellido,
        telefono,
      });
      setMensajeExito('Datos actualizados con éxito.');
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      setMensajeError('Error al actualizar los datos.');
    }
  };

  return (
    <div>
      <h2>Datos Personales</h2>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}

      <label>Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={datosLocales.nombre}
        onChange={manejarCambio}
      />

      <label>Apellido:</label>
      <input
        type="text"
        name="apellido"
        value={datosLocales.apellido}
        onChange={manejarCambio}
      />

      <label>Teléfono:</label>
      <input
        type="text"
        name="telefono"
        value={datosLocales.telefono}
        onChange={manejarCambio}
      />

      <button onClick={actualizarDatos}>Actualizar Datos</button>
    </div>
  );
};

export default DatosPersonales;
