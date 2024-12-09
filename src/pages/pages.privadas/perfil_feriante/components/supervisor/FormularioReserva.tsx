import React, { useState } from 'react';
import './Supervisor.css';

const FormularioReserva: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ nombre, fecha });
    // Aquí podrías enviar los datos a la API o manejarlos según necesites.
  };

  return (
    <div className="formulario-reserva-wrapper">
      <div className="formulario-reserva">
        <h2>Reservar Puesto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="fecha">Fecha:</label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default FormularioReserva;
