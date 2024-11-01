
// FUNCIONES PERFIL ENCARGADO

import axios from "axios";


export const  TraerFeriasEncargado = async (id_user : number)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/private/1` ,{id_user})
      const feria = response.data
      return feria
  }
  catch (error) {
      console.error('Error al traer ferias del encargado', error);
  
    }
  } 







   

   
    