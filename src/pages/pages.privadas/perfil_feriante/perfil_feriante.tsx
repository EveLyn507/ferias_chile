import { useState } from 'react';
import DatosPersonales from './DatosPersonales.tsx';
import Biografia from './Biografia.tsx';
import InteresesVenta from './InteresesVentas.tsx';
import RedesSociales from './RedesSociales.tsx';
import ActualizarCorreoContraseña from './ActualizarCorreoContraseña';
import FotoPerfil from './FotoPerfil.tsx';
import HistorialActividades from './HistorialActividades.tsx';

const PerfilFeriantes  = () => {
  const [perfilPublico, setPerfilPublico] = useState(true); 
  const [intereses, setIntereses] = useState<string[]>([]); 
  const [fotoPerfil, setFotoPerfil] = useState<string>(''); 
  
  const togglePerfil = () => {
    setPerfilPublico(!perfilPublico);
  };

  return (
    <div>
      <h1>Perfil </h1>
      
      <button onClick={togglePerfil}>
        {perfilPublico ? 'Ocultar Perfil (Privado)' : 'Hacer Perfil Público'}
      </button>

      <FotoPerfil fotoPerfil={fotoPerfil} setFotoPerfil={setFotoPerfil} />

      <InteresesVenta intereses={intereses} setIntereses={setIntereses} />

      <DatosPersonales 
        nombre="Nombre del feriante" 
        telefono="123456789" 
        direccion="Calle Ejemplo" 
        setDatosPersonales={() => {}} />

      <Biografia 
        biografia="Esta es la biografía del feriante." 
        setBiografia={() => {}} />

      <RedesSociales />

      <ActualizarCorreoContraseña 
        correo="correo@ejemplo.com" 
        setCorreo={() => {}} 
        setContraseña={() => {}} 
 />

      <HistorialActividades />
    </div>
  );
};

export default PerfilFeriantes ;
