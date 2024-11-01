import React, { useState } from 'react';
import axios from 'axios';

const GestionPuestos: React.FC = () => {
  const [comentario, setComentario] = useState('');
  const [puestos, setPuestos] = useState([]);

  const fetchPuestos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/puestos');
      setPuestos(response.data);
    } catch (error) {
      console.error('Error al cargar puestos:', error);
    }
  };

  const handleAgregarComentario = async (idPuesto: number) => {
    try {
      await axios.post(`http://localhost:5000/api/puestos/${idPuesto}/comentario`, { comentario });
      fetchPuestos();
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Puestos</h2>
      <ul>
        {puestos.map((puesto) => (
          <li key={puesto.id}>
            <p>{puesto.nombre}</p>
            <textarea
              placeholder="Agregar comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            ></textarea>
            <button onClick={() => handleAgregarComentario(puesto.id)}>Agregar Comentario</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionPuestos;