import React, { useState, useEffect } from 'react';
import DatosPersonales from './DatosPersonales';
import Biografia from './Biografia';
import InteresesVenta from './InteresesVentas';
import RedesSociales from './RedesSociales';
import ActualizarCorreoContraseña from './ActualizarCorreoContraseña';
import FotoPerfil from './FotoPerfil';
import HistorialActividades from './HistorialActividades';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../redux/store';
import { Link } from 'react-router-dom';
import { setUserEmail } from '../../../redux/actions/userActions';
import axios from 'axios';

const PerfilFeriantes: React.FC = () => {
  const userMail = useSelector((state: AppStore) => state.user.email); // Obtener correo del estado global
  const dispatch = useDispatch();

  const [fotoPerfil, setFotoPerfil] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [apellido, setApellido] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [biografia, setBiografia] = useState<string>('');
  const [intereses, setIntereses] = useState<string[]>([]);
  const [correo, setCorreo] = useState<string>(userMail);
  const [, setContraseña] = useState<string>('');
  const [perfilPrivado, setPerfilPrivado] = useState<boolean>(false);

  // Manejar la actualización global del correo
  const handleCorreoActualizado = (nuevoCorreo: string) => {
    setCorreo(nuevoCorreo);
    dispatch(setUserEmail(nuevoCorreo));
    localStorage.setItem('userEmail', nuevoCorreo);
  };

  // Manejar el cambio de estado del perfil (público/privado)
  const togglePerfilPrivado = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/perfil/toggle-privado', {
        userMail: correo,
      });

      if (response.status === 200) {
        setPerfilPrivado(response.data.perfil_privado);
      }
    } catch (error) {
      console.error('Error al cambiar el estado del perfil:', error);
    }
  };

  useEffect(() => {
    // Cargar estado inicial del perfil al montar el componente
    const cargarEstadoPerfil = async () => {
      try {
          const response = await axios.get(`http://localhost:5000/api/perfil/estado/${correo}`);
          if (response.status === 200) {
              setPerfilPrivado(response.data.perfil_privado);
          }
      } catch (error) {
          console.error('Error al cargar el estado del perfil:', error);
      }
  };

  if (correo) {
      cargarEstadoPerfil();
  }
}, [correo]);  
  return (
    <>
      <div>
        <h1>Perfil del Feriante</h1>
        <button onClick={togglePerfilPrivado}>
          {perfilPrivado ? 'Hacer Perfil Público' : 'Hacer Perfil Privado'}
        </button>
      </div>

      <FotoPerfil 
        setFotoPerfil={setFotoPerfil} 
        userMail={correo} 
        fotoPerfil={fotoPerfil} 
      />

      <DatosPersonales 
        userMail={correo}
        nombre={nombre}
        apellido={apellido}
        telefono={telefono}
        setDatosPersonales={({ nombre, apellido, telefono }) => {
          setNombre(nombre);
          setApellido(apellido);
          setTelefono(telefono);
        }}
      />

      <Biografia 
        userMail={correo} 
        biografia={biografia} 
        setBiografia={setBiografia} 
      />

      <InteresesVenta 
        userMail={correo} 
        intereses={intereses} 
        setIntereses={setIntereses} 
      />

      <RedesSociales userMail={correo} />

      <ActualizarCorreoContraseña 
        correo={correo}
        setCorreo={setCorreo} 
        setContraseña={setContraseña} 
        onCorreoActualizado={handleCorreoActualizado}
      />

      <HistorialActividades />

      <div>
        <Link to='2/supervisor'> SUPERVISOR </Link>
      </div>
    </>
  );
};

export default PerfilFeriantes;
