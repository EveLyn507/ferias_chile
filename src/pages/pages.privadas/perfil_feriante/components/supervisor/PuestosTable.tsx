import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegación
import axios from 'axios';

interface Puesto {
  id_puesto: number;
  numero: string;
  descripcion: string;
  precio: number;
}

const PuestosTable: React.FC<{ id_feria: number }> = ({ id_feria }) => {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supervisor/puestos`, {
          params: { id_feria: id_feria },
        });
        setPuestos(response.data);
      } catch (err) {
        setError('Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPuestos();
  }, [id_feria]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="puestos-container">
      <h2>Puestos Disponibles</h2>
      <div className="puestos-grid">
        {puestos.map((puesto) => (
          <div key={puesto.id_puesto} className="puesto-card">
            <h3>{puesto.numero}</h3>
            <p><strong>ID Puesto:</strong> {puesto.id_puesto}</p>
            <p><strong>Descripción:</strong> {puesto.descripcion}</p>
            <p><strong>Precio:</strong> {puesto.precio}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/reserva-puesto')}>Reservar Puesto</button>
    </div>
  );
};

export default PuestosTable;
