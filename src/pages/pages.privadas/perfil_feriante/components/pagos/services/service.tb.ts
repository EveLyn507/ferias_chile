// service.tb.ts

import { ActividadPuesto } from "../../../../../models/interfaces";

export const createTransaction = async (puesto : ActividadPuesto , id_user_fte : number , mail : string) => {

  const response = await fetch('http://localhost:5000/api/webpay/create', {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ puesto , id_user_fte ,mail})
  });

  if (!response.ok) {
    throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
  }
  localStorage.setItem('confirm', JSON.stringify(puesto.id_arriendo_puesto))
  const data = await response.json();
  return data;
};
