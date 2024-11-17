/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Card_arriendos } from "./components/detalle_feria/card_puestos";
import { useParams } from "react-router-dom";
import '../../../css/base.css'
import Mapa from "./components/detalle_feria/mapa/mapa_feria";
import { arriendo, plano, PlanoItemElement, todayArriendos } from "./components/detalle_feria/mapa/mapaModel";
import userWebSocketService from "../../models/webSoket";



export const View_detalle_feria = () => {
    const WebSocketService = userWebSocketService.getInstance();
    const {id_feria} = useParams<{id_feria : string}>()
    const idFeria = id_feria ? parseInt(id_feria) : 0 

    // Tipar el estado como un array de objetos "Feria"
    const [puestos , setPuestos] = useState<PlanoItemElement[]>([])
    const [calles , setCalles] = useState<PlanoItemElement[]>([])

    const [arriendos , setArriendos] = useState<arriendo[]>([])
    const[plano, setPlano] = useState<plano>({
        id_feria : idFeria,
        id_plano : null,
        width: 500,
        height : 500
    
      })

    const { nombre_feria } = useParams<{ nombre_feria: string }>() as { nombre_feria: string };
    const {fecha} = useParams<{fecha: string}>() as { fecha: string };



      // Conexión WebSocket solo si no está conectado y no se ha realizado previamente
  useEffect(() => {
    const isSocketConnected = sessionStorage.getItem('socketConnected');

    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  // Marca como conectado
    }
  }, []); // Este effect solo se ejecuta una vez cuando el componente se monta

    const carga = async() => {
       WebSocketService.sendMessage('join_room' ,{id_feria})

        WebSocketService.sendMessage('TodayFeriaElements', {idFeria,nombre_feria, fecha });

        await WebSocketService.RecibeData('ResponceTodayFeriaElements', (data : todayArriendos) => {
            // Filtramos los elementos donde id_tipo_elemento es igual a 1
            console.log(data);
            const puestosday = data.planoData.elements.filter(item => item.id_tipo_elemento === 1)
            const callesday = data.planoData.elements.filter(item => item.id_tipo_elemento === 2)
     
            
            setPlano(data.planoData.plano);
            setPuestos(puestosday)
            setCalles(callesday)
            setArriendos(data.todayArriendos)
        });

    }
 
    useEffect(() => { 
      const espera = async() => {
        await carga()
      }
      espera()


      WebSocketService.RecibeData('roomMSJ', (updated: arriendo) => {
        const updatedArriendos = arriendos.map((arriendo) =>
          arriendo.id_arriendo_puesto === updated.id_arriendo_puesto ? { ...arriendo, ...updated } : arriendo
        );
      
        setArriendos(updatedArriendos); // Asume que `setArriendos` es la función para actualizar el estado
      });
      

      return () => WebSocketService.sendMessage('leave_room' , {idFeria})
    
    }, []);  // El segundo argumento vacío asegura que este effect solo se ejecuta una vez al montar el componente
    


    return (

        <>
            <div>
                <Mapa puestos={puestos} calles={calles} plano={plano}  isStatic={true}/>
            </div>
    
            <div>
                <Card_arriendos arriendos = {arriendos}/>
            </div>
        </>
     
    )
   
};


export default View_detalle_feria;