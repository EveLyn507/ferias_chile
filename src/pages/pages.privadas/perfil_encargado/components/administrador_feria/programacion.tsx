import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgramaFeria } from '../../../../models/interfaces';
import { getProgramaFeria, GuardarProgramacionFeria } from '../../services/admin_feria_fuctions';

const BooleanDaysSelector = () => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ?? ''; 
  const semana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  const [actualPrograma, setActual] = useState<ProgramaFeria[]>([]);
  const [UpdatedPrograma, setUpdatedPro] = useState<ProgramaFeria[]>([]);
  const [isModified, setIsModified] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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

  const validateData = () => {
    const errors: string[] = [];
    UpdatedPrograma.forEach((programa, index) => {
      if (!programa.hora_inicio || !programa.hora_termino) {
        errors.push(`Debe completar las horas de inicio y término en el día ${semana[programa.id_dia]}.`);
      }
      if (programa.hora_inicio >= programa.hora_termino) {
        errors.push(`La hora de inicio debe ser anterior a la hora de término en el día ${semana[programa.id_dia]}.`);
      }
      if (programa.hora_inicio_armado && programa.hora_termino_armado) {
        if (programa.hora_inicio_armado >= programa.hora_termino_armado) {
          errors.push(`La hora de inicio de armado debe ser anterior a la hora de término en el día ${semana[programa.id_dia]}.`);
        }
      }
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

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
    if (!validateData()) {
      console.error("Errores de validación:", validationErrors);
      return;
    }
    if (idFeria !== '') {
      try {
        const result = await GuardarProgramacionFeria(UpdatedPrograma, idFeria);
        console.log('Datos enviados correctamente:', result.message);
        setActual(UpdatedPrograma); 
        setValidationErrors([]); 
      } catch (error) {
        console.error('Error al guardar la programación:', error);
      }
    } else {
      console.log('Error: id_feria es null o undefined', idFeria);
    }
  };

  return (
    <div className="boolean-days-selector">
      {UpdatedPrograma.map((programa, index) => (
        <div 
          key={index} 
          className="boolean-days-item" 
          style={{ marginBottom: '20px', display: 'inline-block', marginTop: '5rem', marginLeft: '2rem' }}
        >
          <strong className="boolean-days-day-label">
            Día de la feria: {semana[programa.id_dia]}
          </strong>
          <br />
          <ul className="boolean-days-list">
            <li className="boolean-days-list-item">
              <label htmlFor={`hora_inicio-${index}`} className="boolean-days-label">
                Hora de inicio:
              </label>
              <input
                type="time"
                id={`hora_inicio-${index}`}
                className="boolean-days-input"
                name="hora_inicio"
                value={programa.hora_inicio}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
            <br />
            <li className="boolean-days-list-item">
              <label htmlFor={`hora_termino-${index}`} className="boolean-days-label">
                Hora de término:
              </label>
              <input
                type="time"
                id={`hora_termino-${index}`}
                className="boolean-days-input"
                name="hora_termino"
                value={programa.hora_termino}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
            <br />
            <strong className="boolean-days-subtitle">Día del armado de la feria</strong>
            <br />
            <li className="boolean-days-list-item">
              <label htmlFor={`id_dia_armado-${index}`} className="boolean-days-label">Día de armado:</label>
              <select
                id={`id_dia_armado-${index}`}
                className="boolean-days-select"
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
            <li className="boolean-days-list-item">
              <label htmlFor={`hora_inicio_armado-${index}`} className="boolean-days-label">
                Hora de inicio armado:
              </label>
              <input
                type="time"
                id={`hora_inicio_armado-${index}`}
                className="boolean-days-input"
                name="hora_inicio_armado"
                value={programa.hora_inicio_armado}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
            <br />
            <li className="boolean-days-list-item">
              <label htmlFor={`hora_termino_armado-${index}`} className="boolean-days-label">
                Hora de término armado:
              </label>
              <input
                type="time"
                id={`hora_termino_armado-${index}`}
                className="boolean-days-input"
                name="hora_termino_armado"
                value={programa.hora_termino_armado}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
            <br />
            <li className="boolean-days-list-item">
              <label htmlFor={`activo-${index}`} className="boolean-days-label">
                Activar horario:
              </label>
              <input
                type="checkbox"
                id={`activo-${index}`}
                className="boolean-days-checkbox"
                name="activo"
                checked={programa.activo}
                onChange={(e) => handleInputChange(index, e)}
              />
            </li>
          </ul>
        </div>
      ))}
      <br />
      {validationErrors.length > 0 && (
        <div className="boolean-days-error" style={{ color: "red" }}>
          {validationErrors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
      <button 
        className="boolean-days-save-btn" 
        onClick={sendData} 
        disabled={!isModified}
      >
        Guardar Programa
      </button>
</div>

  );
};

export default BooleanDaysSelector;
