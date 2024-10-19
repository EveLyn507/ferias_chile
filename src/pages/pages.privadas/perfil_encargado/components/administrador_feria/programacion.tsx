/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState } from 'react';
import { GuardarProgramacionFeria } from '../../services/guardarProgramacion';
import { useParams } from 'react-router-dom';
import { ProgramaFeria } from '../../../../models/interfaces';



const BooleanDaysSelector = () => {
  const [selectedDays, setSelectedDays] = useState<ProgramaFeria>({
    lunes: '0',
    martes: '0',
    miercoles: '0',
    jueves: '0',
    viernes: '0',
    sabado: '0',
    domingo: '0',
  });
  const {id_feria} = useParams<{id_feria : string}>() ;
  const idFeria = id_feria ?? ''

  const handleCheckboxChange = (e:any) => {
    const { name, checked } = e.target;
    setSelectedDays((prevState) => ({
      ...prevState,
      [name]: checked ? '1' : '0',  // Directamente string '1' o '0'
    }));
  };
  console.log('Datos enviados:', selectedDays);
  // Función para enviar los datos
  const sendData =async () => {
    if(idFeria != '') {
         await console.log('Datos enviados:', GuardarProgramacionFeria(selectedDays, idFeria));

    }else {

        console.log('error el id_feria es null o undefined', idFeria)
    }

    
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          name="lunes"
          checked={selectedDays.lunes === '1'}
          onChange={handleCheckboxChange}
        />
        Lunes
      </label>

      <label>
        <input
          type="checkbox"
          name="martes"
          checked={selectedDays.martes === '1'}
          onChange={handleCheckboxChange}
        />
        Martes
      </label>

      <label>
        <input
          type="checkbox"
          name="miercoles"
          checked={selectedDays.miercoles === '1'}
          onChange={handleCheckboxChange}
        />
        Miércoles
      </label>

      <label>
        <input
          type="checkbox"
          name="jueves"
          checked={selectedDays.jueves === '1'}
          onChange={handleCheckboxChange}
        />
        Jueves
      </label>

      <label>
        <input
          type="checkbox"
          name="viernes"
          checked={selectedDays.viernes === '1'}
          onChange={handleCheckboxChange}
        />
        Viernes
      </label>

      <label>
        <input
          type="checkbox"
          name="sabado"
          checked={selectedDays.sabado === '1'}
          onChange={handleCheckboxChange}
        />
        Sábado
      </label>

      <label>
        <input
          type="checkbox"
          name="domingo"
          checked={selectedDays.domingo === '1'}
          onChange={handleCheckboxChange}
        />
        Domingo
      </label>

      {/* Botón para enviar los datos */}
      <button onClick={sendData}>Enviar Datos</button>
    </div>
  );
};

export default BooleanDaysSelector;
