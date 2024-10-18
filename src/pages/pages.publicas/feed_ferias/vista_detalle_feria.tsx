/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Mapa } from "./components/detalle_feria/mapa_feria"
import { Traer_puestos } from "./services/traer_puestos_feria";
import { Card_puestos } from "./components/detalle_feria/card_puestos";
import { useParams } from "react-router-dom";
import '../../../css/base.css'
import { puesto } from "../../models/interfaces";



export const View_detalle_feria = () => {


    // Tipar el estado como un array de objetos "Feria"
    const [puestos, setPuesto] = useState<puesto[]>([]);
    const {id_feria} = useParams<{id_feria: string}>(); 
    useEffect((() => { 
        Traer_puestos(id_feria).then( (res: puesto[]) => {setPuesto(res);}).
        catch((error ) => { console.error("Error al cargar ferias:", error)})
      
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