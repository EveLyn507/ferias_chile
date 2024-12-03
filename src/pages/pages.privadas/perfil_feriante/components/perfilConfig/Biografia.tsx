import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';
import { useToast } from '@components/ToastService'; // Usando alias para importar ToastService

interface BiografiaProps {
  userMail: string;
  biografia: string;
  setBiografia: (bio: string) => void;
}

const Biografia: React.FC<BiografiaProps> = ({ biografia, setBiografia }) => {
  const id_user = useSelector((state: AppStore) => state.user.id_user);
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService
  const maxCaracteres = 500;

  useEffect(() => {
    const cargarBiografia = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cargar-biografia/${id_user}`);
        if (response.ok) {
          const data = await response.json();
          setBiografia(data.biografia || '');
        } else {
          addToast({ type: 'error', message: 'Error al cargar la biografía.' });
        }
      } catch (error) {
        console.error(error);
        addToast({ type: 'error', message: 'Error al conectar con el servidor.' });
      }
    };
    if (id_user) {
      cargarBiografia();
    }
  }, [id_user, setBiografia, addToast]);

  const guardarBiografia = async () => {
    if (biografia.trim() === '') {
      addToast({ type: 'error', message: 'La biografía no puede estar vacía.' });
      return;
    }

    if (biografia.length > maxCaracteres) {
      addToast({
        type: 'error',
        message: `La biografía no puede superar los ${maxCaracteres} caracteres.`,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/guardar-biografia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_user, biografia }),
      });

      if (response.ok) {
        addToast({ type: 'success', message: 'Biografía actualizada con éxito.' });
      } else {
        addToast({ type: 'error', message: 'Error al actualizar la biografía.' });
      }
    } catch (error) {
      console.error(error);
      addToast({ type: 'error', message: 'Error al conectar con el servidor.' });
    }
  };

  return (
    <div>
      <h2>Biografía</h2>
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
