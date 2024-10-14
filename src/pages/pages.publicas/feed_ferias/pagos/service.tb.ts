// service.tb.ts

export const createTransaction = async (buyOrder: string, sessionId: string, amount: number, returnUrl: string) => {
  const response = await fetch('http://localhost:3000/api/webpay/create', {  // URL completa con el puerto 3000
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ buyOrder, sessionId, amount, returnUrl })
  });

  if (!response.ok) {
    throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
