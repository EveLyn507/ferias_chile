/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import Vista from './vistaplano';  // Asegúrate de que la ruta sea correcta

import { PlanoItemElement } from './models/vistaplanoModels';
import WebSocketService from './services/webSoket';


const Vistaplano = () => {

  const webSocketService = new WebSocketService();





  // Crear la conexión WebSocket cuando el componente se monta

  const savePlanoItem = async(selectedItem : PlanoItemElement ) => {
    console.log(selectedItem);
    
    webSocketService.sendMessage('UpdatePuesto' , selectedItem)
       // Recibir un mensaje del servidor
       webSocketService.escucharMessage('datos actualizados')
  }


  useEffect(() => {
    webSocketService.connect()

    return () => {
      webSocketService.disconnect();
  }
},[])

console.log(webSocketService);


  return (
    <div>
      <Vista savePlanoItem={savePlanoItem}/> 
    </div>
  );
};

export default Vistaplano;