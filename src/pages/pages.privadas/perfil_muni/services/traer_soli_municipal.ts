import axios from "axios";
import { solisaperService } from "../rxjs/soliaper";

export const  TraerSolisMunicipal = async (id_user_adm : number)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/getSoliAper` ,{id_user_adm})
      const soli = response.data
      return soli
  }
  catch (error) {
      console.error('Error al traer las solicitudes del admin', error);
  
    }
  } 


  export const  confirmSoli = async (index : number, id_feria : number ,  id_solicitud : number)  =>  {
    const estado = 'Aceptada'
    const id_estado = 2

    try{
      const response  = await axios.post(`http://localhost:5000/confirmSoli` ,{id_feria ,id_solicitud})
      const soli = response.data
      if (response.status ===200) {
        solisaperService.aceptDeclineSoli(index,estado,id_estado)
        return soli
      }else{
        console.log('error al confirmar', response.status);
        
      }

  }
  catch (error) {
      console.error('Error al confirmar la solicitud', error);
  
    }
  } 



  export const  declineSoli = async (index : number, id_feria : number ,  id_solicitud : number)  =>  {
    const estado = 'Rechazada'
    const id_estado = 3
    try{
      const response  = await axios.post(`http://localhost:5000/declineSoli` ,{id_feria , id_solicitud})
      const soli = response.data
      if (response.status ===200) {
        solisaperService.aceptDeclineSoli(index,estado,id_estado)
        return soli
      }else{
        console.log('error al rechazar', response.status);
        
      }
  }
  catch (error) {
      console.error('Error al rechazar la solicitud', error);
  
    }
  } 