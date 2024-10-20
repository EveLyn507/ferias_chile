
import axios from "axios";
import { ProgramaFeria } from "../../../models/interfaces";


export const  GuardarProgramacionFeria = async (programacion : ProgramaFeria ,id_feria : string )  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/administracion/:id_feria'` ,{programacion , id_feria})
      const feria = response.data
      return feria
  }
  catch (error) {
      console.error('Error al insertar programacion de feria  del encargado : ', id_feria, error);
  
    }
  } 



  export const  getProgramaFeria = async (id_feria : string )  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/getProgramacion'` ,{ id_feria})
      const programa = response.data
      return programa
  }
  catch (error) {
      console.error('Error al insertar programacion de feria  del encargado : ', id_feria, error);
  
    }
  } 



