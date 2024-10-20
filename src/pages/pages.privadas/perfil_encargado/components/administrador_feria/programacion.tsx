import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgramaFeria } from '../../../../models/interfaces';
import { getProgramaFeria, GuardarProgramacionFeria } from '../../services/funcProgramacion';

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
  const { id_feria } = useParams<{ id_feria: string }>() ;
  const idFeria = id_feria ?? ''; // O puedes usar un valor como '0' o 'default'

  const [actualPrograma, setActual] = useState<ProgramaFeria>({
    lunes: '0',
    martes: '0',
    miercoles: '0',
    jueves: '0',
    viernes: '0',
    sabado: '0',
    domingo: '0',
  });

  const [newPrograma, setNew] = useState<ProgramaFeria>({
    lunes: '0',
    martes: '0',
    miercoles: '0',
    jueves: '0',
    viernes: '0',
    sabado: '0',
    domingo: '0',
  });

  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    getProgramaFeria(idFeria)
      .then((res: ProgramaFeria) => {
        setActual(res);
        setNew(res);
      })
      .catch((error) => {
        console.error("Error al cargar la programación:", error);
      });
  }, [idFeria]);

  // Verifica si el estado actual es diferente al inicial
  useEffect(() => {
    setIsModified(JSON.stringify(actualPrograma) !== JSON.stringify(newPrograma));
  }, [actualPrograma, newPrograma]);

  // Maneja el cambio de los checkboxes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNew((prevState) => ({
      ...prevState,
      [name]: checked ? '1' : '0', // Cambia a '1' o '0'
    }));
  };

  // Función para enviar los datos
  const sendData = async () => {
    if (idFeria !== '') {
      await GuardarProgramacionFeria(newPrograma, idFeria);

     
      console.log('Datos enviados:', newPrograma);
      setActual(newPrograma)
    
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
            checked={newPrograma[day.name as keyof ProgramaFeria] === '1'}  // Refleja el nuevo estado
            onChange={handleCheckboxChange}
          />
          {day.label}
        </label>
      ))}

      <button onClick={sendData} disabled={!isModified}>
        Enviar Datos
      </button>
    </div>
  );
};

export default BooleanDaysSelector;
