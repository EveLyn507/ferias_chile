/* eslint-disable react-hooks/exhaustive-deps */
import Vista from './vistaplano';  // Asegúrate de que la ruta sea correcta
import { DeletedItem, plano, PlanoItemElement } from './models/vistaplanoModels';
import userWebSocketService from '../../../../models/webSoket';
import { useEffect } from 'react';


// Crear una instancia única del WebSocketService fuera del componente
const Vistaplano = () => {
  const WebSocketService = userWebSocketService.getInstance();

  useEffect(() => {
    const isSocketConnected = sessionStorage.getItem('socketConnected');
    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  // Marca como conectado
    }
  }, []); // Este effect solo se


  const savePlanoItem = async (selectedItem: PlanoItemElement) =>  {
    console.log(selectedItem);
    WebSocketService.sendMessage('UpdatePuesto', selectedItem);

    // Escuchar un mensaje del servidor
    WebSocketService.escucharMessage('datos actualizados');
  };

  const CreateNewItemElement = (newItem: PlanoItemElement): Promise<PlanoItemElement> => {
    WebSocketService.sendMessage('CreateNewItemElement', newItem);
    // Escuchar el evento desde el servidor con una promesa
    return new Promise((resolve, reject) => {
      WebSocketService.RecibeData("ItemCreated", (data) => {
        resolve(data);
      });

      // Timeout opcional si el servidor no responde
      setTimeout(() => reject(new Error("Tiempo de espera agotado")), 5000); // 10 segundos de espera
    });
  };

  const UpdatePlano = async (newPlano : plano) => {
    WebSocketService.sendMessage('UpdatePlano' , newPlano)
  }

  const DeleteItemPlano = async (deletedItem : DeletedItem) => {
    WebSocketService.sendMessage('DeleteItem' , deletedItem)
  }

  // Conecta el socket al montar y lo desconecta al desmontar

  return (
    <div>
      <Vista 
        savePlanoItem={savePlanoItem}
        CreateNewItemElement={CreateNewItemElement} 
        UpdatePlano={UpdatePlano}
        DeleteItemPlano={DeleteItemPlano}
      /> 
    </div>
  );
};

export default Vistaplano;
