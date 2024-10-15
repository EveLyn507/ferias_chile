// service.tb.ts

export const createTransaction = async (buyOrder: string, sessionId: string, amount: number, ) => {
  const response = await fetch('http://localhost:5000/api/webpay/create', {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ buyOrder, sessionId, amount })
  });

  if (!response.ok) {
    throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
