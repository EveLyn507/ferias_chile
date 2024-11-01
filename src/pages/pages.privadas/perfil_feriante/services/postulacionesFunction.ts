import axios from "axios";

  
  
  export const  getVacantesFeria = async ()  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/GetVacantesFeria`)
      const vacantesVacias = response.data
  
      return vacantesVacias
    

  }
  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  } 