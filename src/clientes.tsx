// frontend/src/Clientes.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
}

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Función para obtener los clientes
  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  // Llamar a fetchClientes cuando el componente se monte
  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div>
      <h1>Lista de Clientes</h1>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.nombre} - {cliente.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
