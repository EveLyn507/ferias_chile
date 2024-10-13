/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Feria } from '../../../interfaces';
import { useSelector } from 'react-redux';
import { TraerFeriasEncargado } from '../../../pages.functions';
import { Card_feria_encargado } from './card_feria';

// Define la interfaz para los objetos de feria


const TraerEncargadoFerias = () => {

const mail = useSelector((state: any) => state.user.email);

    const [feriasEn, setFeriasEn] = useState<Feria[]>([]);
   
    useEffect((() => { 
      TraerFeriasEncargado(mail).then( (res: Feria[]) => {setFeriasEn(res)}).
        catch((error ) => { console.error("Error al cargar ferias del encargado:", error)})
      
    }) ,[]);

   
    return (
    <Card_feria_encargado ferias={feriasEn} />

    )
    
};

export default TraerEncargadoFerias;
