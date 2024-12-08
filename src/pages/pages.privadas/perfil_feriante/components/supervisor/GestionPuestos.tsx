import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Puesto {
  id_puesto: number;
  numero: number;
  estado: string;
}

interface GestionPuestosProps {
  id_feria: number | null;
  fecha: string;
}

const GestionPuestos: React.FC<GestionPuestosProps> = ({ id_feria, fecha }) => {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id_feria || isNaN(id_feria)) {
      setError('ID de feria no válido');
      setLoading(false);
      return;
    }
  
    if (!fecha) {
      setError('Fecha no seleccionada');
      setLoading(false);
      return;
    }
  
    const fetchPuestos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/supervisor/puestos/${id_feria}`, 
          { params: { fecha } } // Pasar fecha como parámetro
        );
        setPuestos(response.data);
        setError(null);
      } catch (error) {
        console.log(error);
        setError('Error al obtener los datos de los puestos');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPuestos();
  }, [id_feria, fecha]);

  const togglePuestoEstado = async (id_puesto: number, estado: string) => {
    try {
      const nuevoEstado = estado === 'Disponible' ? 'Bloqueado' : 'Disponible';
      await axios.put(`http://localhost:5000/api/supervisor/puestos/${id_puesto}/estado`, {
        estado: nuevoEstado,
      });
      setPuestos((prevPuestos) =>
        prevPuestos.map((puesto) =>
          puesto.id_puesto === id_puesto ? { ...puesto, estado: nuevoEstado } : puesto
        )
      );
    } catch (err) {
      console.log(err);
      
      setError('Error al actualizar el estado del puesto');
    }
  };

  if (loading) return <p>Cargando datos de los puestos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="gestion-puestos">
      <h2>Gestión de Puestos</h2>
      <ul>
        {puestos.map((puesto) => (
          <li key={puesto.id_puesto}>
            Puesto #{puesto.numero} - Estado: {puesto.estado}
            <button onClick={() => togglePuestoEstado(puesto.id_puesto, puesto.estado)}>
              {puesto.estado === 'Disponible' ? 'Bloquear' : 'Habilitar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionPuestos;
