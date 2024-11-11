/* eslint-disable react-hooks/exhaustive-deps */
// ConfirmPayment.tsx
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { confirmPayment } from './services/commit_pago.ts';

const ConfirmPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id_arriend  = localStorage.getItem('confirm') 
  const idArriendo  =  id_arriend ? parseInt(id_arriend) : 0
  console.log(idArriendo);
  
  useEffect(() => {
    const token = searchParams.get('token_ws'); // Obtener el token de la URL

    
    // Confirmar el pago si existe el token
    if (token) {
      confirmPayment(token ,  idArriendo);
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
