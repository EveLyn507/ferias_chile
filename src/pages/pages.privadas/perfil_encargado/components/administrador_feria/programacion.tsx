/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ProgramaFeria } from '../../../../models/interfaces';
import { GuardarProgramacionFeria } from '../../services/funcProgramacion';

// Lista de días de la semana
const daysOfWeek = [
  { name: 'lunes', label: 'Lunes' },
  { name: 'martes', label: 'Martes' },
  { name: 'miercoles', label: 'Miércoles' },
  { name: 'jueves', label: 'Jueves' },
  { name: 'viernes', label: 'Viernes' },
  { name: 'sabado', label: 'Sábado' },
  { name: 'domingo', label: 'Domingo' },
];

const BooleanDaysSelector = () => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ?? '';

  // Obtén el estado pasado con useLocation
  const location = useLocation();
  const initialPrograma = location.state?.programa || {
    lunes: '0',
    martes: '0',
    miercoles: '0',
    jueves: '0',
    viernes: '0',
    sabado: '0',
    domingo: '0',
  };

  // Estado para los días seleccionados, inicializado con los datos recibidos
  const [selectedDays, setSelectedDays] = useState<ProgramaFeria>(initialPrograma);
  const [isModified, setIsModified] = useState(false);

  // Actualiza el estado cuando se cargan los datos de la programación
  useEffect(() => {
    if (location.state?.programa) {
      setSelectedDays(location.state.programa);
      setIsModified(false); // Reinicia la bandera cuando se cargan los datos iniciales
    }
  }, [location.state?.programa]);

  // Verifica si el estado actual es diferente al inicial
  useEffect(() => {
    const hasChanged = JSON.stringify(selectedDays) !== JSON.stringify(initialPrograma);
    setIsModified(hasChanged); // Actualiza la bandera si ha habido cambios
  }, [selectedDays, initialPrograma]);

  // Maneja el cambio de los checkboxes
  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setSelectedDays((prevState) => ({
      ...prevState,
      [name]: checked ? '1' : '0', // Cambia a '1' o '0'
    }));
  };

  // Función para enviar los datos
  const sendData = async () => {
    if (idFeria !== '') {
      await GuardarProgramacionFeria(selectedDays, idFeria);
      console.log('Datos enviados:', selectedDays);
    } else {
      console.log('Error: id_feria es null o undefined', idFeria);
    }
  };

  return (
    <div>
      {daysOfWeek.map((day) => (
        <label key={day.name}>
          <input
            type="checkbox"
            name={day.name}
            checked={selectedDays[day.name as keyof ProgramaFeria] === '1'}  // Reflecta los datos cargados
            onChange={handleCheckboxChange}
          />
          {day.label}
        </label>
      ))}

      {/* Botón para enviar los datos */}
      <button onClick={sendData} disabled={!isModified}>
        Enviar Datos
      </button>
    </div>
  );
};

export default BooleanDaysSelector;
