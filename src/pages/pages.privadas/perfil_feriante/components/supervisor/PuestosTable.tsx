import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  const handleReserva = (id_puesto: number) => {
    if (id_puesto) {
      // Navegar a la página de reserva con el ID del puesto
      navigate('/reserva-puesto', { state: { id_puesto } });
    } else {
      console.error('ID del puesto no es válido');
    }
  };
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
            <button onClick={() => handleReserva(puesto.id_puesto)}>Reservar Este Puesto</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuestosTable;
