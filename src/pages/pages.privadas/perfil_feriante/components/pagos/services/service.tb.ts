// service.tb.ts

import { arriendo } from "../../../../../pages.publicas/feed_ferias/components/detalle_feria/mapa/mapaModel";


export const createTransaction = async (puesto : arriendo , id_user_fte : number , mail : string) => {

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
  localStorage.setItem('f', JSON.stringify(puesto.id_feria))
  const data = await response.json();
  return data;
};
