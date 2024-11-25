/* eslint-disable react-hooks/exhaustive-deps */
import {  useEffect, useState } from "react";
import { feriasService } from "../rxjs/sharingFeriasEn";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../redux/store";
import userWebSocketService from "../../../models/webSoket";
import { Menu } from "./menu/menu";
import { Feria } from "../../../models/interfaces";
import { Admin_de_feria } from "./vista_admin_de_feria";
import './css/home.css';
import './css/vacantes.css'
import './css/programa.css'

const PerfilEn = () => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);
  const WebSocketService = userWebSocketService.getInstance();
  const [feriasMap, setFeriasMap] = useState<Map<number,Feria>>(new Map())
  const nombresF = Array.from(feriasMap.values()).map(feria => ({id : feria.id_feria, nombre :feria.nombre_feria}) );
  const persistFeria = localStorage.getItem('tabferia')
  const [actualF, setActualF] = useState<Feria | null>(null)




  
  const changeFeria = (id : number ) => {
    const mostrarF = feriasMap.get(id)    
    setActualF(mostrarF!)  
    localStorage.setItem('tabferia' , JSON.stringify(id))
}

  // Conexión WebSocket solo si no está conectado y no se ha realizado previamente
  useEffect(() => {

    if (id_user_enf) {
      feriasService.loadInitialData(id_user_enf);
    }
    const subscribe = feriasService.ferias$.subscribe((feriasEn) => {
      const map = new Map(feriasEn.map(feria => [feria.id_feria, feria]));
      setFeriasMap(map)
      if(persistFeria) {     
        const mostrarF = map.get(Number(persistFeria)) 
        setActualF(mostrarF!)  
      }
    } )

   
    const isSocketConnected = sessionStorage.getItem('socketConnected');

    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  
    }
    return () => subscribe.unsubscribe()
  }, []); 




  return (
    <div className="enf-container">

      <div className="enfmenu-container">
        <Menu nombresF={nombresF} changeFeria={changeFeria} />
      </div>

      <div className="admin-f-container">
         {actualF ? <Admin_de_feria feria={actualF}/> : <p>aca se podrian poner actividades generales etcetc</p> }
  
      </div>
  
    </div>
  );
};

export default PerfilEn;
