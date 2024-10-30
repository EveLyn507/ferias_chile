/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { Feria } from '../../../../models/interfaces';
import { useSelector } from 'react-redux';

import { TraerFeriasEncargado } from '../../services/traer_ferias_encargado';
import { Card_feria_encargado } from './card_feria_encargado';

const TraerEncargadoFerias = () => {
  const id_user = useSelector((state: any) => state.user.id_user);
  const [feriasEn, setFeriasEn] = useState<Feria[]>([]); // Asegúrate de inicializar como array vacío

  const GetData = async () => {
    const data = await TraerFeriasEncargado(id_user)

    if (data.status === 404) {
      
      console.log('no hay datos');
    }else {
      setFeriasEn(data)
      console.log('datos cargados', data);     
    }
  } 

  useEffect( () => { 
    GetData()
  }, []);

  console.log(feriasEn);

  return (
    <div>
      {Array.isArray(feriasEn) && feriasEn.length === 0 ? ( // Verifica que feriasEn sea un array
        <p>Aún no has creado tu primera feria.</p>
      ) : (
        <Card_feria_encargado ferias={feriasEn} />
      )}
    </div>
  );
};

export default TraerEncargadoFerias;
