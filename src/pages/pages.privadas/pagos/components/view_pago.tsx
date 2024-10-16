import React from 'react';
import { createTransaction } from '../services/service.tb';

const PaymentButton: React.FC = () => {
  const handlePayment = async () => {
    const buyOrder = 'order123';
    const sessionId = 'session123';
    const amount = 10000; // monto en pesos chilenos


    try {
      const { url, token } = await createTransaction(buyOrder, sessionId, amount);
      // Redirigir al usuario a la página de pago
      window.location.href = `${url}?token_ws=${token}`;
    } catch (error) {
      console.error('Error al crear la transacción:', error);
    }
  };

  return (
    <button onClick={handlePayment}>Pagar con Webpay</button>
  );
};

export default PaymentButton;
