import React from 'react';
import { createTransaction } from './services/service.tb';
import { useLocation } from 'react-router-dom';
import { ActividadPuesto } from '../../../../models/interfaces';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';
import { id_datos_puesto } from './rxjsx/sharing.puesto.pago';



const PaymentButton: React.FC = () => {

  const location = useLocation();
  
  const puesto = location.state.puesto || {}; // Extraemos 'puesto' del estado
  const id_user_fte = useSelector((store : AppStore) =>  store.user.id_user)
  const mail = useSelector((store : AppStore) =>  store.user.email)
  console.log(puesto.id_arriendo_puesto);
  const handlePayment = async (puesto : ActividadPuesto, id_user_fte : number , mail : string) => {
   
    
     await id_datos_puesto.setSubject(puesto.id_arriendo_puesto); 

    try {
      const { url, token } = await createTransaction(puesto, id_user_fte, mail);
      // Redirigir al usuario a la página de pago
      window.location.href = `${url}?token_ws=${token}`;
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


<button onClick={() => handlePayment(puesto , id_user_fte , mail)}>Pagar con Webpay</button>

</>
);
};
export default PaymentButton;