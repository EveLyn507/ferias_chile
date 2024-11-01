import React, { useState } from 'react';
import axios from 'axios';

const GestionPuestos: React.FC = () => {
  const [comentario, setComentario] = useState('');
  const [puestoId, setPuestoId] = useState<number | null>(null);

  const agregarComentario = async () => {
    try {
      await axios.post('http://localhost:5000/api/supervisor/puestos/comentario', {
        puestoId,
        comentario,
      });
      alert('Comentario agregado');
      setComentario('');
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Puestos</h2>
      <input
        type="number"
        placeholder="ID del Puesto"
        value={puestoId || ''}
        onChange={(e) => setPuestoId(parseInt(e.target.value))}
      />
      <textarea
        placeholder="Comentario"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />
      <button onClick={agregarComentario}>Agregar Comentario</button>
    </div>
  );
};

export default GestionPuestos;