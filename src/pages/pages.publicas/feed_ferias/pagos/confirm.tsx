export const confirmPayment = async (token_ws : string) => {
    try {
      const response = await fetch('http://localhost:5000/api/webpay/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token_ws }), // Enviar el token en el body
      });
  
      if (!response.ok) {
        throw new Error('Error al confirmar la transacción');
      }
  
      const data = await response.json();
      console.log('Respuesta de la confirmación:', data);
      // Maneja la respuesta de la confirmación aquí
    } catch (error) {
      console.error('Error al confirmar la transacción:', error);
    }
  };
  