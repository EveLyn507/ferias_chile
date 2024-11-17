/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';
import { id_datos_puesto } from './rxjsx/sharing.puesto.pago';
import { arriendo } from '../../../../pages.publicas/feed_ferias/components/detalle_feria/mapa/mapaModel';
import userWebSocketService from '../../../../models/webSoket';



const PaymentButton: React.FC = () => {

  const WebSocketService = userWebSocketService.getInstance()
  const location = useLocation();
  const puesto = location.state.arriendo || {}; // Extraemos 'puesto' del estado

  const id_user_fte = useSelector((store : AppStore) =>  store.user.id_user)
  const mail = useSelector((store : AppStore) =>  store.user.email)


  useEffect(() => {
    const isSocketConnected = sessionStorage.getItem('socketConnected');

    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  // Marca como conectado
    }
  }, []); // Este effect solo se


  const handlePayment = async (puesto : arriendo, id_user_fte : number , mail : string) => {
     await id_datos_puesto.setSubject(puesto.id_arriendo_puesto); 
     
    try {
      WebSocketService.sendMessage('CreateTransaction' , {puesto , id_user_fte, mail})
     await  WebSocketService.RecibeData('opentbk' ,(data) => {
    // Redirigir al usuario a la página de pago
      if(data.null){
        console.log('error al abrir tbk');
        return
      }else{
        window.location.href = `${data.url}?token_ws=${data.token}`;
      }


      })
  
    } catch (error) {
      console.error('Error al crear la transacción:', error);
    }
  };





  return (
<>
<h2> Puesto a contratar</h2>
<div>
<li> numero puesto : {puesto.numero}</li>
<li> nombre feria : {puesto.nombre_feria}</li>
<li> inicio : {puesto.hora_inicio}</li>
<li> termino : {puesto.hora_termino}</li>
<li> precio : {puesto.precio}</li>

</div>


<button onClick={() => handlePayment(puesto , id_user_fte , mail )}>Pagar con Webpay</button>

</>
);
};
export default PaymentButton;
