import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgramaFeria } from '../../../../models/interfaces';
import { getProgramaFeria, GuardarProgramacionFeria } from '../../services/admin_feria_fuctions';

const BooleanDaysSelector = () => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ?? ''; // O puedes usar un valor como '0' o 'default'

  const [actualPrograma, setActual] = useState<ProgramaFeria[]>([]); // Lista de programas actual
  const [UpdatedPrograma, setUpdatedPro] = useState<ProgramaFeria[]>([]);  //lista modificada que se enviara al bakend al guardarla
  const [isModified, setIsModified] = useState(false);

  console.log(UpdatedPrograma);
  
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

  // Verifica si el estado actual es diferente al inicial
  useEffect(() => {
    setIsModified(JSON.stringify(actualPrograma) !== JSON.stringify(UpdatedPrograma));
  }, [actualPrograma, UpdatedPrograma]);

  // Maneja el cambio de los inputs de texto
// Función para manejar cambios en los inputs
const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, type, checked, value } = e.target;

  // Si el tipo de input es checkbox, utilizamos 'checked', si no, 'value'
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


// Función para enviar los datos
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
    <>
    <div>
      {UpdatedPrograma.map((programa, index) => (
        <div key={index} style={{ marginBottom: '20px' , display : 'inline-block' , marginTop: '5rem', marginLeft : '2rem' }}>
          <strong>
            Día de la feria: {programa.dia}
           
          </strong>
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
          <br />
          <strong>dia del armado de la feria</strong>
          <br />
          <select
            name="id_dia_armado"
            value={programa.id_dia_armado}
            onChange={(e) => handleSelectChange(index, e)}  // Pasamos el evento completo
            >
            <option value="1">El mismo día</option>
            <option value="2">Un día antes</option>
            <option value="3">Déjame elegir</option>
            </select>


          <br />

          <label>
            Hora de inicio armado:
            <input
              type="time"
              name="hora_inicio_armado"
              value={programa.hora_inicio_armado}
              onChange={(e) => handleInputChange(index, e)}
            />
          </label>
          <br />
          <label>
            Hora de término armado:
            <input
              type="time"
              name="hora_termino_armado"
              value={programa.hora_termino_armado}
              onChange={(e) => handleInputChange(index, e)}
            />
          </label>
          <br />

          <label htmlFor="">
            activar horario
            <input
              type="checkbox"
              name="activo"
              checked={programa.activo} 
              onChange={(e) => handleInputChange(index, e)} 
            />
          </label>

        </div>
      ))}
      <br />
      <button onClick={sendData} disabled={!isModified}>
        Guardar Programa
      </button>
    </div>
    </>
  );
};

export default BooleanDaysSelector;
