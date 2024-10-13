/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Mapa } from "./mapa_feria"
import { Traer_puestos } from "./traer_puestos_feria";
import { Item_list_puestos } from "./list_puestos";
import { useParams } from "react-router-dom";
import '../../../../css/base.css'



interface puesto {
    id_puesto :number,
    num_puesto: number,
    num_horario: number,
    hora_inicio :string,
    hora_termino :string,
    precio :number
}

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
                <Item_list_puestos puestos = {puestos}/>
            </div>
        </>
     
    )
   
};


export default View_detalle_feria;