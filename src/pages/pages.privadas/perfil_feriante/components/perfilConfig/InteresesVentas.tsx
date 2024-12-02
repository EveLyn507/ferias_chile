import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';
import { useToast } from '@components/ToastService'; // Importa el servicio de Toast

interface InteresesVentaProps {
  userMail: string;
  intereses: string[];
  setIntereses: (intereses: string[]) => void;
}

const InteresesVenta: React.FC<InteresesVentaProps> = ({ intereses, setIntereses }) => {
  const id_user = useSelector((state: AppStore) => state.user.id_user);
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService
  const [nuevoInteres, setNuevoInteres] = useState('');

  useEffect(() => {
    const cargarIntereses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cargar-intereses/${id_user}`);
        if (response.ok) {
          const data = await response.json();
          setIntereses(data || []);
        } else {
          addToast({ type: 'error', message: 'Error al cargar los intereses.' });
        }
      } catch (error) {
        console.error(error);
        addToast({ type: 'error', message: 'Error al conectar con el servidor.' });
      }
    };

    if (id_user) {
      cargarIntereses();
    }
  }, [id_user, setIntereses, addToast]);

  const agregarInteres = async () => {
    if (!nuevoInteres.trim()) {
      addToast({ type: 'error', message: 'El interés no puede estar vacío.' });
      return;
    }

    if (intereses.includes(nuevoInteres)) {
      addToast({ type: 'error', message: 'El interés ya existe.' });
      return;
    }

    if (intereses.length >= 10) {
      addToast({ type: 'error', message: 'No puedes agregar más de 10 intereses.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/actualizar-intereses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_user, intereses: [...intereses, nuevoInteres] }),
      });

      if (response.ok) {
        setIntereses([...intereses, nuevoInteres]);
        setNuevoInteres('');
        addToast({ type: 'success', message: 'Interés agregado con éxito.' });
      } else {
        addToast({ type: 'error', message: 'Error al agregar el interés.' });
      }
    } catch (error) {
      console.error(error);
      addToast({ type: 'error', message: 'Error al conectar con el servidor.' });
    }
  };

  const eliminarInteres = async (interes: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/actualizar-intereses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_user, intereses: intereses.filter((i) => i !== interes) }),
      });

      if (response.ok) {
        setIntereses(intereses.filter((i) => i !== interes));
        addToast({ type: 'success', message: 'Interés eliminado con éxito.' });
      } else {
        addToast({ type: 'error', message: 'Error al eliminar el interés.' });
      }
    } catch (error) {
      console.error(error);
      addToast({ type: 'error', message: 'Error al conectar con el servidor.' });
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
        onChange={(e) => setNuevoInteres(e.target.value)}
        placeholder="Agregar interés"
      />
      <button onClick={agregarInteres}>Agregar</button>
    </div>
  );
};

export default InteresesVenta;
