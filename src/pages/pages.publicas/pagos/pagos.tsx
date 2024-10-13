import React, { useState } from 'react';
import axios from 'axios';

const Pago: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/webpay/init', { amount });

      const { url } = response.data;

      console.log('Redirigiendo a:', url);  // Verificar que la URL es correcta
      window.location.href = url;
    } catch (error) {
      console.error('Error al iniciar el pago', error);
    }
  };
  return (
    <div>
      <h2>Realizar Pago</h2>
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={handlePayment}>Pagar</button>
    </div>
  );
};

export default Pago;
