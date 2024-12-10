import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Puesto {
  id_puesto: number;
  numero: string;
  descripcion: string;
  precio: number;
  id_arriendo_puesto : number
}

interface tablePuesto { 
  id_feria : number,
  fecha : string
}


const PuestosTable = ({ id_feria, fecha } : tablePuesto) => {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
 
  const fetchPuestos = async () => {  
    try {    
      const response = await axios.post(`http://localhost:5000/api/supervisor/getPuestosDisponibles`,{id_feria , fecha}
      );
      setPuestos(response.data);
    } catch (err) {
      setError('Error al cargar los datos.' +  err);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {

    fetchPuestos();
  }, [id_feria, fecha]);

  const handleReserva = (id_arriendo_puesto: number, precio : number) => {
    if (id_arriendo_puesto) {
      // Navegar a la página de reserva con el ID del puesto
      navigate('/reserva-puesto', { state: { id_arriendo_puesto, precio } });
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
            <p><strong>Puesto:</strong> {puesto.numero} - precio {puesto.precio}        <button onClick={() => handleReserva(puesto.id_arriendo_puesto , puesto.precio)}>Reservar Este Puesto</button></p>

          </div>
          
        ))}
      </div>
    </div>
  );
};

export default PuestosTable;
