
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




  
  export const getProgramaFeria = async (id_feria: string): Promise<ProgramaFeria > => {




    try {
      const response = await axios.get(`http://localhost:5000/getProgramacion/${id_feria}`);
      
      // Supongamos que la respuesta de la API es un objeto que ya tiene la estructura de ProgramaFeria
      const programa: ProgramaFeria = {
        lunes: response.data.lunes || '0', // Si no hay dato, establecer a '0'
        martes: response.data.martes || '0',
        miercoles: response.data.miercoles || '0',
        jueves: response.data.jueves || '0',
        viernes: response.data.viernes || '0',
        sabado: response.data.sabado || '0',
        domingo: response.data.domingo || '0',
      };
  
   
      return programa;
    } catch (error) {
      console.error('Error al obtener la programación de feria del encargado:', error);
      
      return {}; // Devolver null en caso de error
    }
  };
  



