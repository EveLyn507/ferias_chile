/* eslint-disable react-hooks/exhaustive-deps */
// ConfirmPayment.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { confirmPayment } from './pagos/services/commit_pago.ts';
import { id_datos_puesto } from './pagos/rxjsx/sharing.puesto.pago.ts';

const ConfirmPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const subscribe = id_datos_puesto.getSubject();
  const [idPuesto , setIdpuesto] = useState(1) 

  useEffect(() => {
    const token = searchParams.get('token_ws'); // Obtener el token de la URL
     subscribe.subscribe(data =>  { 
      setIdpuesto(data)
     });
    
    // Confirmar el pago si existe el token
    if (token) {
      confirmPayment(token ,  idPuesto);
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
