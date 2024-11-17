/* eslint-disable react-hooks/exhaustive-deps */
// ConfirmPayment.tsx
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import userWebSocketService from '../../../../models/webSoket.ts';

const ConfirmPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id_arriend  = localStorage.getItem('confirm') 
  const f  = localStorage.getItem('f') 
  const id_feria = parseInt(f!)
  const idArriendo  =  id_arriend ? parseInt(id_arriend) : 0
  console.log(idArriendo);
  const WebSocketService = userWebSocketService.getInstance()

  useEffect(() => {
    const isSocketConnected = sessionStorage.getItem('socketConnected');

    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  // Marca como conectado
    }
  }, []); // Este effect solo se

  useEffect(() => {
    const token = searchParams.get('token_ws'); // Obtener el token de la URL
    // Confirmar el pago si existe el token
    console.log(token);

    if (token) {
      WebSocketService.sendMessage('confirm_Transaction', {token, idArriendo , id_feria})
      const com = async () => {
        await WebSocketService.RecibeData('comittbk' , (data) => {
          console.log(data);
          
        })
      }
      com()
     
    }
   
  }, []);


  return (
    <div>
      <h1>Confirmando el Pago...</h1>
      <p>Por favor, espere...</p>
    </div>
  );
};

export default ConfirmPayment;
