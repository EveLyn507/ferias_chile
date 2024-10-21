import { useState, useEffect } from 'react';
import DatosPersonales from './DatosPersonales';
import Biografia from './Biografia';
import InteresesVenta from './InteresesVentas';
import RedesSociales from './RedesSociales';
import ActualizarCorreoContraseña from './ActualizarCorreoContraseña';
import FotoPerfil from './FotoPerfil';
import HistorialActividades from './HistorialActividades';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../redux/store';

const PerfilFeriantes: React.FC = () => {
  const userMail = useSelector((state: AppStore) => state.user.email);

  const [perfilPublico, setPerfilPublico] = useState<boolean>(true);
  const [intereses, setIntereses] = useState<string[]>([]);
  const [fotoPerfil, setFotoPerfil] = useState<string>('');  
  const [datosPersonales, setDatosPersonales] = useState<{ nombre: string; apellido: string; telefono: string }>({
    nombre: '',
    apellido: '', 
    telefono: '',
  });
  const [biografia, setBiografia] = useState<string>(''); 
  const [correo, setCorreo] = useState<string>(''); 
  const [contraseña, setContraseña] = useState<string>('');

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const encodedMail = encodeURIComponent(userMail);  
        const response = await fetch(`http://localhost:5000/api/perfil/${encodedMail}`);
        
        if (response.ok) {
          const perfilData = await response.json();
          
          setCorreo(perfilData.correo || ''); 
          setDatosPersonales({
            nombre: perfilData.nombre || '',
            apellido: perfilData.apellido || '',  
            telefono: perfilData.telefono || ''
          });
          setBiografia(perfilData.biografia || '');  
          setIntereses(perfilData.intereses || []);
          setFotoPerfil(perfilData.url_foto_perfil || '');  

          console.log('Perfil cargado correctamente:', perfilData);
        } else {
          console.error('Error al cargar el perfil');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };

    cargarPerfil();  
  }, [userMail]);
    
  const togglePerfil = () => {
    setPerfilPublico(!perfilPublico);
  };
  const guardarPerfil = async () => {
    const perfilData = {
      nombre: datosPersonales.nombre,
      apellido: datosPersonales.apellido,  
      telefono: datosPersonales.telefono,
      biografia: biografia,
      intereses: intereses,
      correo: correo,
      contraseña: contraseña, 
      userMail: userMail,
      url_foto_perfil: fotoPerfil, 
    };

    try {
      const response = await fetch('http://localhost:5000/api/perfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perfilData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Perfil guardado:', result);
      } else {
        console.error('Error al guardar el perfil');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  return (
    <div>
      <h1>Perfil del Feriante</h1>

      <button onClick={togglePerfil}>
        {perfilPublico ? 'Ocultar Perfil (Privado)' : 'Hacer Perfil Público'}
      </button>

      <button onClick={guardarPerfil}>Guardar Perfil</button>

      <FotoPerfil setFotoPerfil={setFotoPerfil} userMail={userMail} fotoPerfil={fotoPerfil} />

      <DatosPersonales 
        setDatosPersonales={setDatosPersonales} 
        nombre={datosPersonales.nombre} 
        apellido={datosPersonales.apellido}  
        telefono={datosPersonales.telefono}        
      />
      <Biografia biografia={biografia} setBiografia={setBiografia} />
      <InteresesVenta intereses={intereses} setIntereses={setIntereses} />
      <RedesSociales />

      <ActualizarCorreoContraseña 
        correo={correo} 
        setCorreo={setCorreo} 
        setContraseña={setContraseña} 
      />
      <HistorialActividades />
    </div>
  );
};

export default PerfilFeriantes;
