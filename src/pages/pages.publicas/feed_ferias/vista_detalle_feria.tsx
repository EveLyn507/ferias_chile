/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Mapa } from "./components/detalle_feria/mapa_feria"
import {  Traer_puestos_actividad } from "./services/traer_puestos_feria";
import { Card_puestos } from "./components/detalle_feria/card_puestos";
import { useParams } from "react-router-dom";
import '../../../css/base.css'
import {  ActividadPuesto } from "../../models/interfaces";



export const View_detalle_feria = () => {


    // Tipar el estado como un array de objetos "Feria"
    const [puestos, setPuesto] = useState<ActividadPuesto[]>([]);
    const { nombre_feria } = useParams<{ nombre_feria: string }>() as { nombre_feria: string };
    const {fecha} = useParams<{fecha: string}>() as { fecha: string };
  
    
    const carga = async () => {
        await Traer_puestos_actividad(nombre_feria,fecha).then( (res: ActividadPuesto[]) => {setPuesto(res);}).
        catch((error ) => { console.error("Error al cargar ferias:", error)})
    }

    useEffect((() => { 
       carga()
      
    }) ,[]);


    return (

        <>
            <div>
                <Mapa/>
            </div>
    
            <div>
                <Card_puestos puestos = {puestos}/>
            </div>
        </>
     
    )
   
};


export default View_detalle_feria;