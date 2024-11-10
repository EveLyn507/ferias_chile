import axios from "axios";

export const  TraerSolisMunicipal = async (id_user_adm : number)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/getSoliAper` ,{id_user_adm})
      const soli = response.data
      return soli
  }
  catch (error) {
      console.error('Error al traer ferias del encargado', error);
  
    }
  } 


  export const  confirmSoli = async (id_feria : number)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/confirmSoli` ,{id_feria})
      const soli = response.data
      return soli
  }
  catch (error) {
      console.error('Error al traer ferias del encargado', error);
  
    }
  } 



  export const  declineSoli = async (id_feria : number)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/declineSoli` ,{id_feria})
      const soli = response.data
      return soli
  }
  catch (error) {
      console.error('Error al traer ferias del encargado', error);
  
    }
  } 