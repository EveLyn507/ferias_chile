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
  const [contraseña, setContraseña] = useState<string>('');


  // Manejar la actualización global del correo
  const handleCorreoActualizado = (nuevoCorreo: string) => {
    setCorreo(nuevoCorreo); // Actualizar estado local del componente
    dispatch(setUserEmail(nuevoCorreo)); // Actualiza el correo en el estado global de Redux
    localStorage.setItem('userEmail', nuevoCorreo); // También actualiza en el almacenamiento local si es necesario
  };

  return (
    <>
    <div>
      <h1>Perfil del Feriante</h1>
      

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

      <RedesSociales />

      <ActualizarCorreoContraseña 
        correo={correo}
        setCorreo={setCorreo} 
        setContraseña={setContraseña} 
        onCorreoActualizado={handleCorreoActualizado}
      />

      <HistorialActividades />
    </div>

      <Link to='2/supervisor'> SUPERVISOR </Link>
    <Link to='postulaciones'> POSTULACIONES </Link>
   </>
  );
};

export default PerfilFeriantes;
