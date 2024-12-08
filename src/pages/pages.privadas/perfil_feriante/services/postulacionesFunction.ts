import axios from "axios";
import { postulacion } from "../../../models/interfaces";

  
  
  export const  getFeriasConVacantesVacias = async (id_comuna : number | null , id_region : number | null)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/getFeriasConVacantesVacias` , {id_comuna, id_region})
      const vacantesVacias = response.data  
      return vacantesVacias
    

  }
  catch (error) {
      console.error('Error al cargar las vacantes : ', error);
  
    }
  } 

export const getVacantesFeria  =  async (id_feria : number) => {
  try{
    const response  = await axios.post(`http://localhost:5000/getVacantesFeria` , {id_feria})
    const vacantesVacias = response.data
    console.log(vacantesVacias);
    
    return vacantesVacias
  

}
catch (error) {
    console.error('Error al cargar las vacantes : ', error);

  }

}


  export const  insertPostulacion = async (postulacion : postulacion)  =>  {

    
    try{
      const response  = await axios.post(`http://localhost:5000/insertPostulacion`, {postulacion})
      console.log(response.data);
      
  }
  catch (error) {
      console.error('Error al insertar la postulacion: ', error);
  
    }
  } 




  

  export const  getMiPostulacion = async ( id_user_fte: number)  =>  {

    
    try{
      const response  = await axios.post(`http://localhost:5000/getMisPostulaciones`, {id_user_fte})
       const data = response.data
       console.log(data)
       return data
     
      
  }
  catch (error) {
      console.error('Error al cargar las postulaciones del usuario: ', error);
  
    }
  } 



export const loadCompras = async (id_user_fte : number) => {
    
  try{
    const response  = await axios.post(`http://localhost:5000/fteLoadCompras`, {id_user_fte})
     const data = response.data
  
     return data
   
    
}
catch (error) {
    console.error('Error al cargar las postulaciones del usuario: ', error);

  }
} 


