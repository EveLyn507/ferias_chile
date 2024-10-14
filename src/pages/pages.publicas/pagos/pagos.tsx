
const Pago: React.FC = () => {
  const handlePayment = async () => {
  
    try {
      const amount = 10000; // Monto en pesos chilenos
      const response = await fetch('http://localhost:5000/webpay/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      

      
      const data = await response.json();
      console.log('Response from Webpay:', data);
      // Aquí puedes redirigir al usuario a data.url
    } catch (error) {
      console.error('Error al crear la transacción:', error);
    }
  };
  

  return(

    <button onClick={handlePayment}> Pagar</button>
  )
}
export default Pago;
