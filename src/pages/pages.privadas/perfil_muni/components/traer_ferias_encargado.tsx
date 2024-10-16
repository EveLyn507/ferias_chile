/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {  solicitud } from '../../../models/interfaces';
import { Card_soli_muni } from './card_soli';
import { TraerSolisMunicipal } from '../services/traer_soli_municipal';


// Define la interfaz para los objetos de feria


const TraerMuniSolicitudes = () => {

const mail = useSelector((state: any) => state.user.email);

    const [solicitudes, setSolis] = useState<solicitud[]>([]);
   
    useEffect((() => { 
      TraerSolisMunicipal(mail).then( (res: solicitud[]) => {setSolis(res)}).
        catch((error ) => { console.error("Error al cargar ferias del encargado:", error)})
      
    }) ,[]);
    console.log(solicitudes)
    
    return (
    <Card_soli_muni solicitudes={solicitudes} />

    )
    
};

export default TraerMuniSolicitudes;
