/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';
import { arriendo } from '../../../../pages.publicas/feed_ferias/components/detalle_feria/mapa/mapaModel';
import userWebSocketService from '../../../../models/webSoket';
import './Pagos.css';


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

     
  localStorage.setItem('confirm', JSON.stringify(puesto.id_arriendo_puesto))
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
      <h2 className="payment-title">Puesto a contratar</h2>
      <div className="payment-info">
        <li className="payment-item">Número puesto: {puesto.numero}</li>
        <li className="payment-item">Nombre feria: {puesto.nombre_feria}</li>
        <li className="payment-item">Inicio: {puesto.hora_inicio}</li>
        <li className="payment-item">Término: {puesto.hora_termino}</li>
        <li className="payment-item">Precio: {puesto.precio}</li>
      </div>
      <button 
        className="payment-button" 
        onClick={() => handlePayment(puesto , id_user_fte , mail )}
      >
        Pagar con Webpay
      </button>
    </>
  );
};

export default PaymentButton;
