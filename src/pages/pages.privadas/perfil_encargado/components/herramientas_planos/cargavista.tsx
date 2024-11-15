import { useEffect } from 'react';
import Vista from './vistaplano';  // Asegúrate de que la ruta sea correcta

import { DeletedItem, plano, PlanoItemElement } from './models/vistaplanoModels';
import WebSocketService from './services/webSoket';

// Crear una instancia única del WebSocketService fuera del componente
const webSocketService = new WebSocketService();

const Vistaplano = () => {

  const savePlanoItem = async (selectedItem: PlanoItemElement) =>  {
    console.log(selectedItem);
    webSocketService.sendMessage('UpdatePuesto', selectedItem);

    // Escuchar un mensaje del servidor
    webSocketService.escucharMessage('datos actualizados');
  };

  const CreateNewItemElement = (newItem: PlanoItemElement): Promise<PlanoItemElement> => {
    webSocketService.sendMessage('CreateNewItemElement', newItem);

    // Escuchar el evento desde el servidor con una promesa
    return new Promise((resolve, reject) => {
      webSocketService.RecibeData("ItemCreated", (data) => {

        resolve(data);

      });

      // Timeout opcional si el servidor no responde
      setTimeout(() => reject(new Error("Tiempo de espera agotado")), 5000); // 10 segundos de espera
    });
  };

  const UpdatePlano = async (newPlano : plano) => {
    webSocketService.sendMessage('UpdatePlano' , newPlano)
  }

  const DeleteItemPlano = async (deletedItem : DeletedItem) => {
    webSocketService.sendMessage('DeleteItem' , deletedItem)
  }

  // Conecta el socket al montar y lo desconecta al desmontar
  useEffect(() => {
    webSocketService.connect();
    return () => {
      webSocketService.disconnect();
    };
  }, []);

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
