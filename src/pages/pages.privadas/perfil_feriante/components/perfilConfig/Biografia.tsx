import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';

interface BiografiaProps {
  userMail: string;
  biografia: string;
  setBiografia: (bio: string) => void;
}

const Biografia: React.FC<BiografiaProps> = ({ biografia, setBiografia }) => {
  const id_user = useSelector((state: AppStore) => state.user.id_user);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const maxCaracteres = 500;

  useEffect(() => {
    const cargarBiografia = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cargar-biografia/${id_user}`);
        if (response.ok) {
          const data = await response.json();
          setBiografia(data.biografia || '');
        } else {
          setMensajeError('Error al cargar la biografía.');
        }
      } catch (error) {
        console.log(error);
        
        setMensajeError('Error al conectar con el servidor.');
      }
    };
    if (id_user) {
      cargarBiografia();
    }
  }, [id_user, setBiografia]);

  const guardarBiografia = async () => {
    setMensajeError(null);
    setMensajeExito(null);

    if (biografia.trim() === '') {
      setMensajeError('La biografía no puede estar vacía.');
      return;
    }

    if (biografia.length > maxCaracteres) {
      setMensajeError(`La biografía no puede superar los ${maxCaracteres} caracteres.`);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/guardar-biografia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_user, biografia }),
      });

      if (response.ok) {
        setMensajeExito('Biografía actualizada con éxito.');
      } else {
        setMensajeError('Error al actualizar la biografía.');
      }
    } catch (error) {
      console.log(error);
      
      setMensajeError('Error al conectar con el servidor.');
    }
  };

  return (
    <div>
      <h2>Biografía</h2>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
      <textarea
        value={biografia}
        onChange={(e) => setBiografia(e.target.value)}
        placeholder="Escribe una breve biografía (máx. 500 caracteres)"
        rows={5}
        maxLength={maxCaracteres}
      />
      <p>{biografia.length}/{maxCaracteres} caracteres</p>
      <button onClick={guardarBiografia}>Guardar Biografía</button>
    </div>
  );
};

export default Biografia;
