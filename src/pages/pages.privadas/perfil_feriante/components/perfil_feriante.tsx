/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import FTEWebSocketService from '../../../models/webSoket';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../redux/store';
import ConfiguracionPerfil from './perfilConfig';
import { HomePostulaciones } from './postulaciones/homePostulaciones';
import { Menu } from './menu/menufte';
import './home.css';

const PerfilFeriantes: React.FC = () => {

  const webSocketService = FTEWebSocketService.getInstance();
  const id_user_fte = useSelector((store : AppStore) => store.user.id_user)
  const viewPersist = localStorage.getItem('view')

  const[menuView,setMenuView] = useState<string>('configuracion')



  const changePersitView= (view:string) => {
    setMenuView(view)
    localStorage.setItem('view' , view)
}

  const views : Record<string , JSX.Element>=  {
    'configuracion' : <ConfiguracionPerfil/>,
    'postulaciones' : <HomePostulaciones/>
  }
  useEffect(() => {   
   
     
    if(viewPersist){
      setMenuView(viewPersist)
    }
    const isSocketConnected = sessionStorage.getItem('socketConnected');

    if (!isSocketConnected || webSocketService.socket === null) {
      webSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  
    }

  }, []); 


  return (

    <div className="fte-container">

    <div className="ftemenu-container">
      <Menu setMenuView={changePersitView} />
    </div>

    <div className="perfil-content-container">
      {views[menuView]}
    </div>

  </div>
  );
};

export default PerfilFeriantes;
