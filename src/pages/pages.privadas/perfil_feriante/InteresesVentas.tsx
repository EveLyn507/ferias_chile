import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../redux/store';

interface InteresesVentaProps {
  userMail: string;
  intereses: string[];
  setIntereses: (intereses: string[]) => void;
}

const InteresesVenta: React.FC<InteresesVentaProps> = ({ intereses, setIntereses }) => {
  const userMail = useSelector((state: AppStore) => state.user.email);
  const id_user = useSelector((state: AppStore) => state.user.id_user);
  const [nuevoInteres, setNuevoInteres] = useState('');

  useEffect(() => {
    const cargarIntereses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cargar-intereses/${id_user}`);
        if (response.ok) {
          const data = await response.json();
          setIntereses(data);
        }
      } catch (error) {
        console.error('Error al cargar intereses:', error);
      }
    };

    if (id_user) {
      cargarIntereses();
    }
  }, [id_user, setIntereses]);

  const agregarInteres = async () => {
    if (nuevoInteres && intereses.length < 10) {
      try {
        const response = await fetch('http://localhost:5000/api/actualizar-intereses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_user, intereses: [...intereses, nuevoInteres] }),
        });

        if (response.ok) {
          setIntereses([...intereses, nuevoInteres]);
          setNuevoInteres('');
        }
      } catch (error) {
        console.error('Error al agregar el interés:', error);
      }
    }
  };

  const eliminarInteres = async (interes: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/actualizar-intereses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_user, intereses: intereses.filter(i => i !== interes) }),
      });

      if (response.ok) {
        setIntereses(intereses.filter(i => i !== interes));
      }
    } catch (error) {
      console.error('Error al eliminar el interés:', error);
    }
  };

  return (
    <div>
      <h2>Intereses de Venta</h2>
      <ul>
        {intereses.map((interes, index) => (
          <li key={index}>
            {interes}
            <button onClick={() => eliminarInteres(interes)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <input 
        type="text" 
        value={nuevoInteres} 
        onChange={e => setNuevoInteres(e.target.value)} 
        placeholder="Agregar interés"
      />
      <button onClick={agregarInteres}>Agregar</button>
    </div>
  );
};

export default InteresesVenta;
