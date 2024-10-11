import React, { useState } from 'react';

interface BiografiaProps {
  biografia: string;
  setBiografia: (bio: string) => void;
}

const Biografia: React.FC<BiografiaProps> = ({ biografia, setBiografia }) => {
  const [biografiaActualizada, setBiografiaActualizada] = useState(biografia);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const maxCaracteres = 500;

  const handleBiografiaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nuevaBiografia = e.target.value;

    // Validar si la biografía excede el límite de caracteres
    if (nuevaBiografia.length > maxCaracteres) {
      setMensajeError(`La biografía no puede exceder los ${maxCaracteres} caracteres.`);
      setMensajeExito(null);
    } else {
      setBiografiaActualizada(nuevaBiografia);
      setMensajeError(null);
    }
  };

  const actualizarBiografia = () => {
    if (biografiaActualizada.trim() === '') {
      setMensajeError('La biografía no puede estar vacía.');
      setMensajeExito(null);
      return;
    }

    // Si la biografía es válida, actualizamos
    setBiografia(biografiaActualizada);
    setMensajeExito('Biografía actualizada con éxito.');
    setMensajeError(null);
  };

  return (
    <div>
      <h2>Biografía</h2>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
      <textarea
        value={biografiaActualizada}
        onChange={handleBiografiaChange}
        placeholder="Escribe una breve biografía (máx. 500 caracteres)"
        rows={5}
        maxLength={maxCaracteres}
      />
      <p>{biografiaActualizada.length}/{maxCaracteres} caracteres</p>
      <button onClick={actualizarBiografia}>Actualizar Biografía</button>
    </div>
  );
};

export default Biografia;
