import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppStore } from '../../../../../redux/store';
import { useSelector } from 'react-redux';
import { useToast } from '@components/ToastService'; // Importar ToastService

interface RedesSocialesProps {
  userMail: string;
}

const RedesSociales: React.FC<RedesSocialesProps> = ({ userMail }) => {
  const id_user = useSelector((state: AppStore) => state.user.id_user);
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService
  const [enlaces, setEnlaces] = useState<
    { id: number; tipo: string; url: string; url_foto_red: string }[]
  >([]);
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
        addToast({ type: 'error', message: 'Error al cargar tipos de redes sociales.' });
      }
    };
    obtenerTiposRed();
  }, [addToast]);

  useEffect(() => {
    const cargarEnlaces = async () => {
      try {
        console.log(`Cargando redes sociales para: ${userMail}`);
        const response = await axios.get(`http://localhost:5000/api/redes-sociales/${userMail}`);
        setEnlaces(response.data);
        console.log('Redes sociales cargadas:', response.data);
      } catch (error) {
        console.error('Error al cargar redes sociales:', error);
        addToast({ type: 'error', message: 'Error al cargar redes sociales.' });
      }
    };

    if (userMail) {
      cargarEnlaces();
    }
  }, [userMail, addToast]);

  const agregarEnlace = async () => {
    if (!nuevoEnlace.trim()) {
      addToast({ type: 'error', message: 'El enlace no puede estar vacío.' });
      return;
    }

    if (!tipoRed) {
      addToast({ type: 'error', message: 'Debe seleccionar una red social.' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/redes-sociales', {
        id_user,
        tipoRed,
        url: nuevoEnlace,
      });
      setEnlaces([...enlaces, response.data]);
      setNuevoEnlace('');
      setTipoRed('');
      addToast({ type: 'success', message: 'Red social agregada con éxito.' });
    } catch (error) {
      console.error('Error al agregar red social:', error);
      addToast({ type: 'error', message: 'Error al agregar red social.' });
    }
  };

  const eliminarEnlace = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/redes-sociales/${id}`);
      setEnlaces(enlaces.filter((enlace) => enlace.id !== id));
      addToast({ type: 'success', message: 'Red social eliminada con éxito.' });
    } catch (error) {
      console.error('Error al eliminar red social:', error);
      addToast({ type: 'error', message: 'Error al eliminar red social.' });
    }
  };

  return (
    <div>
      <h2>Redes Sociales</h2>
      <ul>
        {enlaces.map((enlace) => (
          <li key={enlace.id}>
            <img
              src={enlace.url_foto_red}
              alt={`${enlace.tipo} logo`}
              style={{ width: '20px', height: '20px', marginRight: '10px' }}
            />
            {enlace.tipo}:{' '}
            <a href={enlace.url} target="_blank" rel="noopener noreferrer">
              {enlace.url}
            </a>
            <button onClick={() => eliminarEnlace(enlace.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <div>
        <select value={tipoRed} onChange={(e) => setTipoRed(e.target.value)}>
          <option value="" key="default">
            Seleccione una red social
          </option>
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
