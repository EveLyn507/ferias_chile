// GestionSupervisor.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GestionSupervisor: React.FC = () => {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alertas');
        setAlertas(response.data);
      } catch (error) {
        console.error('Error al cargar alertas:', error);
      }
    };
    fetchAlertas();
  }, []);

  return (
    <div>
      <h2>Gestión de Supervisor</h2>
      <nav>
        <ul>
          <li>
            <Link to="/estado-feria">Ver Estado de Feria</Link>
          </li>
          <li>
            <Link to="/gestion-puestos">Gestión de Puestos</Link>
          </li>
          <li>
            <Link to="/mapa-feria">Ver Mapa de la Feria</Link>
          </li>
        </ul>
      </nav>
      
      <h3>Alertas e Incidentes</h3>
      <ul>
        {alertas.map((alerta, index) => (
          <li key={index}>{alerta.descripcion}</li>
        ))}
      </ul>
    </div>
  );
};

export default GestionSupervisor;
