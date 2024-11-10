import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgramaFeria } from '../../../../models/interfaces';
import { getProgramaFeria, GuardarProgramacionFeria } from '../../services/admin_feria_fuctions';

const BooleanDaysSelector = () => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ?? ''; // O puedes usar un valor como '0' o 'default'
  const semana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  const [actualPrograma, setActual] = useState<ProgramaFeria[]>([]); // Lista de programas actual
  const [UpdatedPrograma, setUpdatedPro] = useState<ProgramaFeria[]>([]);  // lista modificada que se enviara al backend al guardarla
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    getProgramaFeria(idFeria)
      .then((res: ProgramaFeria[]) => {
        setActual(res); 
        setUpdatedPro([...res]); 
      })
      .catch((error) => {
        console.error("Error al cargar la programación:", error);
      });
  }, [idFeria]);

  useEffect(() => {
    setIsModified(JSON.stringify(actualPrograma) !== JSON.stringify(UpdatedPrograma));
  }, [actualPrograma, UpdatedPrograma]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setUpdatedPro((prevState) =>
      prevState.map((programa, i) =>
        i === index ? { ...programa, [name]: inputValue } : programa
      )
    );
  };

  const handleSelectChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setUpdatedPro((prevState) =>
      prevState.map((programa, i) =>
        i === index ? { ...programa, [name]: parseInt(value, 10) } : programa
      )
    );
  };

  const sendData = async () => {
    if (idFeria !== '') {
      try {
        const result = await GuardarProgramacionFeria(UpdatedPrograma, idFeria);
        console.log('Datos enviados correctamente:', result.message);
        setActual(UpdatedPrograma); // Actualiza el estado actual con los datos nuevos
      } catch (error) {
        console.error('Error al guardar la programación:', error);
      }
    } else {
      console.log('Error: id_feria es null o undefined', idFeria);
    }
  };

  return (
    <div>
      {UpdatedPrograma.map((programa, index) => (
        <div key={index} style={{ marginBottom: '20px', display: 'inline-block', marginTop: '5rem', marginLeft: '2rem' }}>
          <strong>
            Día de la feria: {semana[programa.id_dia]}
          </strong>
          <br />
          <ul>
            <li>
              <label htmlFor={`hora_inicio-${index}`}>
                Hora de inicio:
              </label>
              <input
                type="time"
                id={`hora_inicio-${index}`}
                name="hora_inicio"
                value={programa.hora_inicio}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
            <br />
            <li>
              <label htmlFor={`hora_termino-${index}`}>
                Hora de término:
              </label>
              <input
                type="time"
                id={`hora_termino-${index}`}
                name="hora_termino"
                value={programa.hora_termino}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
            <br />
            <strong>Dia del armado de la feria</strong>
            <br />
            <li>
              <label htmlFor={`id_dia_armado-${index}`}>Día de armado:</label>
              <select
                id={`id_dia_armado-${index}`}
                name="id_dia_armado"
                value={programa.id_dia_armado}
                onChange={(e) => handleSelectChange(index, e)}
              >
                <option value="1">El mismo día</option>
                <option value="2">Un día antes</option>
                <option value="3">Déjame elegir</option>
              </select>
            </li>
            <br />
            <li>
              <label htmlFor={`hora_inicio_armado-${index}`}>
                Hora de inicio armado:
              </label>
              <input
                type="time"
                id={`hora_inicio_armado-${index}`}
                name="hora_inicio_armado"
                value={programa.hora_inicio_armado}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
            <br />
            <li>
              <label htmlFor={`hora_termino_armado-${index}`}>
                Hora de término armado:
              </label>
              <input
                type="time"
                id={`hora_termino_armado-${index}`}
                name="hora_termino_armado"
                value={programa.hora_termino_armado}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
            <br />
            <li>
              <label htmlFor={`activo-${index}`}>
                Activar horario:
              </label>
              <input
                type="checkbox"
                id={`activo-${index}`}
                name="activo"
                checked={programa.activo}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
          </ul>
        </div>
      ))}
      <br />
      <button onClick={sendData} disabled={!isModified}>
        Guardar Programa
      </button>
    </div>
  );
};

export default BooleanDaysSelector;
