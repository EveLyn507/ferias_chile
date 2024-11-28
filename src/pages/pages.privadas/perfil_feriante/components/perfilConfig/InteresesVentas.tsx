import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';

interface InteresesVentaProps {
  userMail: string;
  intereses: string[];
  setIntereses: (intereses: string[]) => void;
}

const InteresesVenta: React.FC<InteresesVentaProps> = ({ intereses, setIntereses }) => {
  const id_user = useSelector((state: AppStore) => state.user.id_user);
  const [nuevoInteres, setNuevoInteres] = useState('');
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    const cargarIntereses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cargar-intereses/${id_user}`);
        if (response.ok) {
          const data = await response.json();
          setIntereses(data || []);
        } else {
          setMensajeError('Error al cargar los intereses.');
        }
      } catch (error) {
        console.log(error);
        
        setMensajeError('Error al conectar con el servidor.');
      }
    };

    if (id_user) {
      cargarIntereses();
    }
  }, [id_user, setIntereses]);

  const agregarInteres = async () => {
    setMensajeError(null);
    setMensajeExito(null);

    if (!nuevoInteres.trim()) {
      setMensajeError('El interés no puede estar vacío.');
      return;
    }

    if (intereses.includes(nuevoInteres)) {
      setMensajeError('El interés ya existe.');
      return;
    }

    if (intereses.length >= 10) {
      setMensajeError('No puedes agregar más de 10 intereses.');
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
        setMensajeExito('Interés agregado con éxito.');
      } else {
        setMensajeError('Error al agregar el interés.');
      }
    } catch (error) {
      console.log(error);
      
      setMensajeError('Error al conectar con el servidor.');
    }
  };

  const eliminarInteres = async (interes: string) => {
    setMensajeError(null);
    setMensajeExito(null);

    try {
      const response = await fetch('http://localhost:5000/api/actualizar-intereses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_user, intereses: intereses.filter((i) => i !== interes) }),
      });

      if (response.ok) {
        setIntereses(intereses.filter((i) => i !== interes));
        setMensajeExito('Interés eliminado con éxito.');
      } else {
        setMensajeError('Error al eliminar el interés.');
      }
    } catch (error) {
      console.log(error);
      
      setMensajeError('Error al conectar con el servidor.');
    }
  };

  return (
    <div>
      <h2>Intereses de Venta</h2>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
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
