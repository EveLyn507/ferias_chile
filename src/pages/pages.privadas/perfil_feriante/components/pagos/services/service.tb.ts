// service.tb.ts

import { puesto } from "../../../../../models/interfaces";

export const createTransaction = async (puesto : puesto , mail : string) => {
  const response = await fetch('http://localhost:5000/api/webpay/create', {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ puesto , mail})
  });

  if (!response.ok) {
    throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
