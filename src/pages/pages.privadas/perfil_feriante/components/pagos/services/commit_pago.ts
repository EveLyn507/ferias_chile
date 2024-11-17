export const confirmPayment = async (token_ws : string , id_arriendo_puesto : number , id_puesto : number) => {
    try {
      const response = await fetch('http://localhost:5000/api/webpay/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token_ws  ,id_arriendo_puesto , id_puesto}), // Enviar el token en el body
      });
  
      if (response.ok) {
        const data = await response.json();
      console.log('Respuesta de la confirmación:', data);
      // Maneja la respuesta de la confirmación aquí
      }else{
        const data = await response.json();
        console.log('Respuesta de la confirmación:', data);
      }
  
    
    } catch (error) {
      
      console.error('Error al confirmar la transacción:', error);
    }
  };  
  