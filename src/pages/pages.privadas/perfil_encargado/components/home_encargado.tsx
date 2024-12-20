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
import './css/tables.css'
import './css/programa.css'
import './css/banco.css'
import BancosHome from "./bancos/bancos_home";
import FeriaForm from "./formulario/formulario_feria";

const PerfilEn = () => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);
  const WebSocketService = userWebSocketService.getInstance();
  const [feriasMap, setFeriasMap] = useState<Map<number,Feria>>(new Map())
  const nombresF = Array.from(feriasMap.values()).map(feria => ({id : feria.id_feria, nombre :feria.nombre_feria}) );
  const persistFeria = localStorage.getItem('tabferia')
  const [actualF, setActualF] = useState<Feria | null>(null)
  const[menuView,setMenuView] = useState<string>('admin')

  const loadData = () => {
    if (id_user_enf) {
      feriasService.loadInitialData(id_user_enf);
      const subscribe = feriasService.ferias$.subscribe((feriasEn) => {
      const map = new Map(feriasEn.map(feria => [feria.id_feria, feria]));
      setFeriasMap(map)
      if(persistFeria) {     
        const mostrarF = map.get(Number(persistFeria)) 
        setActualF(mostrarF!)  
      }
    
    })
    return () => subscribe.unsubscribe()
  }
  
}

  const views : Record<string , JSX.Element>=  {
    'admin' : actualF ? <Admin_de_feria feria={actualF}/> : <p>aca se podrian poner actividades generales etcetc</p>,
    'banco' : <BancosHome/>,
    'nueva-feria' : <FeriaForm loadData= {loadData}/>
  }


  const changeFeria = (id : number ) => {
    const mostrarF = feriasMap.get(id)    
    setActualF(mostrarF!)  
    localStorage.setItem('tabferia' , JSON.stringify(id))
}

  // Conexión WebSocket solo si no está conectado y no se ha realizado previamente

  
  useEffect(() => {
      loadData()
    const isSocketConnected = sessionStorage.getItem('socketConnected');

    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  
    }

  }, []); 




  return (
    <div className="enf-container">

      <div className="enfmenu-container">
        <Menu nombresF={nombresF} changeFeria={changeFeria} setMenuView={setMenuView} id_feria={Number(persistFeria)!}/>
      </div>

      <div className="admin-f-container">
        {views[menuView]}
      </div>
  
    </div>
  );
};

export default PerfilEn;
