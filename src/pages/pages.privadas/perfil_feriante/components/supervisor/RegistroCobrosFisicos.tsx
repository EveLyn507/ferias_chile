import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Feriante {
  id_user_fte: number;
  nombre: string;
  pagado: boolean;
}

interface RegistroCobrosFisicosProps {
  id_feria: number;
}

const RegistroCobrosFisicos: React.FC<RegistroCobrosFisicosProps> = ({ id_feria }) => {
  const [feriantes, setFeriantes] = useState<Feriante[]>([]);

  useEffect(() => {
    const fetchFeriantes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/supervisor/feriantes-pendientes', {
          params: { id_feria }, 
        });
        setFeriantes(response.data);
      } catch (error) {
        console.error('Error al obtener lista de pagos pendientes:', error);
      }
    };
    fetchFeriantes();
  }, [id_feria]);

  const registrarPago = async (id_user_fte: number) => {
    try {
      await axios.put(`http://localhost:5000/api/supervisor/feriantes/${id_user_fte}/pago`);
      setFeriantes((prev) =>
        prev.map((feriante) =>
          feriante.id_user_fte === id_user_fte ? { ...feriante, pagado: true } : feriante
        )
      );
    } catch (error) {
      console.error('Error al registrar el pago físico:', error);
    }
  };

  return (
    <div>
      <h2>Registro de Cobros Físicos</h2>
      <ul>
        {feriantes.map((feriante) => (
          <li key={feriante.id_user_fte}>
            {feriante.nombre} - {feriante.pagado ? 'Pagado' : 'Pendiente'}
            {!feriante.pagado && (
              <button onClick={() => registrarPago(feriante.id_user_fte)}>Marcar como Pagado</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistroCobrosFisicos;
