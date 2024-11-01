import axios from "axios";
import { postulacion } from "../../../models/interfaces";

  
  
  export const  getVacantesVaciasfte = async ()  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/getVacantesVacias`)
      const vacantesVacias = response.data
      console.log(vacantesVacias);
      
      return vacantesVacias
    

  }
  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  } 




  export const  insertPostulacion = async (postulacion : postulacion)  =>  {

    
    try{
      const response  = await axios.post(`http://localhost:5000/insertPostulacion`, {postulacion})
      console.log(response.data);
      
  }
  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  } 