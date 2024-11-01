import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppStore } from '../../../redux/store';
import { useSelector } from 'react-redux';

interface RedesSocialesProps {
  userMail: string;
}

const RedesSociales: React.FC<RedesSocialesProps> = ({ userMail }) => {
  const id_user = useSelector((state: AppStore) => state.user.id_user);
  const [enlaces, setEnlaces] = useState<{ id: number; tipo: string; url: string; url_foto_red: string }[]>([]);
  const [nuevoEnlace, setNuevoEnlace] = useState('');
  const [tipoRed, setTipoRed] = useState<string>(''); // Red social seleccionada
  const [tiposRed, setTiposRed] = useState<{ id: number; red_social: string; url_foto_red: string }[]>([]);

  // Cargar tipos de redes sociales disponibles
  useEffect(() => {
    const obtenerTiposRed = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tipos-red');
        setTiposRed(response.data);
      } catch (error) {
        console.error('Error al cargar tipos de redes sociales:', error);
      }
    };
    obtenerTiposRed();
  }, []);

  useEffect(() => {
    const cargarEnlaces = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/redes-sociales/${userMail}`);
        setEnlaces(response.data);
      } catch (error) {
        console.error('Error al cargar redes sociales:', error);
      }
    };
    if (userMail) cargarEnlaces();
  }, [userMail]);

  const agregarEnlace = async () => {
    if (nuevoEnlace && tipoRed) {
      try {
        const response = await axios.post('http://localhost:5000/api/redes-sociales', {
          id_user,
          tipoRed,
          url: nuevoEnlace,
        });
        setEnlaces([...enlaces, response.data]);
        setNuevoEnlace('');
        setTipoRed('');
      } catch (error) {
        console.error('Error al agregar red social:', error);
      }
    }
  };

  const eliminarEnlace = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/redes-sociales/${id}`);
      setEnlaces(enlaces.filter((enlace) => enlace.id !== id));
    } catch (error) {
      console.error('Error al eliminar red social:', error);
    }
  };

  return (
    <div>
      <h2>Redes Sociales</h2>
      <ul>
        {enlaces.map((enlace) => (
          <li key={enlace.id}>
            <img src={enlace.url_foto_red} alt={`${enlace.tipo} logo`} style={{ width: '20px', height: '20px', marginRight: '10px' }} />
            {enlace.tipo}: <a href={enlace.url} target="_blank" rel="noopener noreferrer">{enlace.url}</a>
            <button onClick={() => eliminarEnlace(enlace.id)}>Eliminar</button>
       | </li>
        ))}
      </ul>

      <div>
      <select value={tipoRed} onChange={(e) => setTipoRed(e.target.value)}>
      <option value="">Seleccione una red social</option>
      {tiposRed.map((red) => (
      <option key={red.id} value={red.red_social}>
        {red.red_social}
      </option>
  ))}
</select>
        <input
          type="text"
          value={nuevoEnlace}
          onChange={(e) => setNuevoEnlace(e.target.value)}
          placeholder="Agregar enlace"
        />
        <button onClick={agregarEnlace}>Agregar</button>
      </div>
    </div>
  );
};

export default RedesSociales;
