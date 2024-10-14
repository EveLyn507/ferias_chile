import { useState } from 'react';
import DatosPersonales from './DatosPersonales.tsx';
import Biografia from './Biografia.tsx';
import InteresesVenta from './InteresesVentas.tsx';
import RedesSociales from './RedesSociales.tsx';
import ActualizarCorreoContraseña from './ActualizarCorreoContraseña.tsx';
import FotoPerfil from './FotoPerfil.tsx';
import HistorialActividades from './HistorialActividades.tsx';


const PerfilFeriantes: React.FC = () => {
  const [perfilPublico, setPerfilPublico] = useState(true);
  const [intereses, setIntereses] = useState<string[]>([]);
  const [fotoPerfil, setFotoPerfil] = useState<string>('');
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
  });
  const [biografia, setBiografia] = useState('');
  const [correo, setCorreo] = useState('');

  const togglePerfil = () => {
    setPerfilPublico(!perfilPublico);
  };

  const guardarPerfil = async () => {
    const perfilData = {
      nombre: datosPersonales.nombre,
      telefono: datosPersonales.telefono,
      direccion: datosPersonales.direccion,
      biografia: biografia,
      intereses: intereses,  
      correo: correo,
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
      <h1>Perfil del Comerciante</h1>

      <button onClick={togglePerfil}>
        {perfilPublico ? 'Ocultar Perfil (Privado)' : 'Hacer Perfil Público'}
      </button>

      <button onClick={guardarPerfil}>Guardar Perfil</button>

      <FotoPerfil fotoPerfil={fotoPerfil} setFotoPerfil={setFotoPerfil} />

      <InteresesVenta intereses={intereses} setIntereses={setIntereses} />

      <DatosPersonales 
        nombre={datosPersonales.nombre} 
        telefono={datosPersonales.telefono}
        direccion={datosPersonales.direccion}
        setDatosPersonales={setDatosPersonales}
      />

      <Biografia 
        biografia={biografia}
        setBiografia={setBiografia}
      />

      <RedesSociales />

      <ActualizarCorreoContraseña 
        correo={correo}
        setCorreo={setCorreo}
        setContraseña={() => {}}
      />

      <HistorialActividades />
    </div>
  );
};

export default PerfilFeriantes;
