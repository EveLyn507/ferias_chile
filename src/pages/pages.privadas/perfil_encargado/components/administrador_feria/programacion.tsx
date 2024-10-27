import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgramaFeria } from '../../../../models/interfaces';
import { getProgramaFeria, GuardarProgramacionFeria } from '../../services/admin_feria_fuctions';

const BooleanDaysSelector = () => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ?? ''; // O puedes usar un valor como '0' o 'default'

  const [actualPrograma, setActual] = useState<ProgramaFeria[]>([]); // Lista de programas
  const [newPrograma, setNew] = useState<ProgramaFeria[]>([]); // Lista de nuevos programas
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    getProgramaFeria(idFeria)
      .then((res: ProgramaFeria[]) => {
        setActual(res); // Actualiza con la lista de programas actuales
        setNew([...res]); // Inicializa la nueva lista con los valores actuales
      })
      .catch((error) => {
        console.error("Error al cargar la programación:", error);
      });
  }, [idFeria]);

  // Verifica si el estado actual es diferente al inicial
  useEffect(() => {
    setIsModified(JSON.stringify(actualPrograma) !== JSON.stringify(newPrograma));
  }, [actualPrograma, newPrograma]);

  // Maneja el cambio de los inputs de texto
  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNew((prevState) =>
      prevState.map((programa, i) =>
        i === index ? { ...programa, [name]: value } : programa
      )
    );
  };

  // Función para enviar los datos
  const sendData = async () => {
    if (idFeria !== '') {
      await GuardarProgramacionFeria(newPrograma, idFeria);
      console.log('Datos enviados:', newPrograma);
      setActual(newPrograma); // Actualiza el estado actual con los datos nuevos
    } else {
      console.log('Error: id_feria es null o undefined', idFeria);
    }
  };

  return (
    <div>
      {newPrograma.map((programa, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <label>
            Día:
            <input
              type="text"
              name="dia"
              value={programa.dia}
              onChange={(e) => handleInputChange(index, e)}
            />
          </label>
          <br />
          <label>
            Hora de inicio:
            <input
              type="time"
              name="hora_inicio"
              value={programa.hora_inicio}
              onChange={(e) => handleInputChange(index, e)}
            />
          </label>
          <br />
          <label>
            Hora de término:
            <input
              type="time"
              name="hora_termino"
              value={programa.hora_termino}
              onChange={(e) => handleInputChange(index, e)}
            />
          </label>
        </div>
      ))}

      <button onClick={sendData} disabled={!isModified}>
        Enviar Datos
      </button>
    </div>
  );
};

export default BooleanDaysSelector;
