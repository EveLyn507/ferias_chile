import axios from "axios";

export const  TraerSolisMunicipal = async (mail : string)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/private/3` ,{mail})
      const soli = response.data
      return soli
  }
  catch (error) {
      console.error('Error al traer ferias del encargado', error);
  
    }
  } 