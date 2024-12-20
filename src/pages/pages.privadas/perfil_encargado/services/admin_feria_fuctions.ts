
import axios from "axios";
import { DatosBank, horarioVacante, ProgramaFeria, vacante } from "../../../models/interfaces";
import { VacanteService } from "../rxjs/sharingVacantes";
import { bancoService } from "../rxjs/sharingbankslist";

// PROGRAMACION DE LA FERIA
export const  GuardarProgramacionFeria = async (programa : ProgramaFeria ,id_feria : number )  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/administracion/:id_feria` ,{programa , id_feria})
        return  response.status

  
}
  catch (error) {
      console.error('Error al insertar programacion de feria  del encargado : ', id_feria, error);
  
    }
  } 

  export const getProgramaFeria = async (id_feria: number): Promise<ProgramaFeria[]> => {
    try {
      const response = await axios.get(`http://localhost:5000/getProgramacion/${id_feria}`);
      
      // Supongamos que la respuesta de la API es un objeto que ya tiene la estructura de ProgramaFeria

      return response.data
   
  
    } catch (error) {
      console.error('Error al obtener la programación de feria del encargado:', error);
      
      return null // Devolver null en caso de error
    }
  };
  


  // DATOS BANCARIOS ASOCIADOS

  export const  saveDatosBank = async ( encargadoBank : DatosBank)  =>  {

    try{
      const response = await axios.post(`http://localhost:5000/insertBank` ,{encargadoBank})
        
       bancoService.addBanco(encargadoBank); // Actualizar la lista en el servicio
        const ok = response.data
        return ok
    
  }
  catch (error) {
      console.error('Error al insertar programacion de feria  del encargado : ', error);
  
    }
  } 


  export const  updateDatosBank = async ( encargadoBank : DatosBank)  =>  {

    try{
      const response = await axios.post(`http://localhost:5000/updateDatosBank` ,{encargadoBank})
        
       bancoService.updateBanco(encargadoBank); // Actualizar la lista en el servicio
        const ok = response.data
        return ok
    
  }
  catch (error) {
      console.error('Error al insertar programacion de feria  del encargado : ', error);
  
    }
  } 


  
  export const  getDatosBank = async (id_user_enf : number)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/getBank` ,{id_user_enf})
      const banco = response.data

      return banco
    

  }
  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  } 

  export const  deleteBank = async (mail_banco : string)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/deleteBank` ,{mail_banco})
      return response
        

  }
  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  } 


  export const  getFeriaBank = async (id_feria : number)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/getFeriaBank` ,{id_feria})
      const {mail_banco} = response.data
      
      return mail_banco
    

  }
  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  } 



  
  export const  asociarBankFeria = async (mail_banco : string | null , id_feria : number)  =>  {
    try{
        const response  = await axios.post(`http://localhost:5000/asociarBankFeria` ,{mail_banco,id_feria}) 
      }
  catch (error) {
      console.error('Error al asociar  los datos del banco : ', error);
  
    }
  } 







//VACANTES MODULO

  export const  getVacantesFeria = async (mail : string , id_feria : number)  =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/GetVacantesFeria` ,{mail , id_feria})
      const banco = response.data
  
      return banco
    

  }
  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  } 



  export const  saveVacanteFeria = async (vacante : vacante)   =>  {

    try{
      const response  = await axios.post(`http://localhost:5000/insertVacantesFeria` ,{ vacante})
    
      const resVacante = response.data;

      // Agrega la vacante a rxjs vacantes
      VacanteService.addVacante(resVacante);


  }
  catch (error) {
      console.error('Error al cargar los datos de la vacante : ', error);
  
    }
  } 



  export const  updateHorarioVacante = async (horarios : horarioVacante[] , id_feria : number)  =>  {

    try{
        await axios.post(`http://localhost:5000/updateHorarioVacante` ,{horarios})
       //elemina la vacante de rxjs vacantes
       
    }  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  }
   
      



export const  updateVacanteFeria = async (vacante : vacante , id_feria : number)  =>  {

    try{
       const result = await axios.post(`http://localhost:5000/updateVacanteFeria` ,{vacante})
       //elemina la vacante de rxjs vacantes
       await updateHorarioVacante(vacante.horarios, id_feria)
       const algo = result.data
       console.log(algo);
       
      VacanteService.updateVacante(vacante, id_feria); // Actualiza la lista usando RxJS
      
  }
  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  } 



  export const  deleteVacante = async (id_vacante : number)  =>  {

    try{
       await axios.post(`http://localhost:5000/deleteVacante` ,{id_vacante})
       //elemina la vacante de rxjs vacantes
      VacanteService.removeVacante(id_vacante); // Actualiza la lista usando RxJS
      
  }
  catch (error) {
      console.error('Error al cargar los datos del banco : ', error);
  
    }
  } 




  export const  getPostulacionesEnf = async (id_user_enf :number , id_feria : number , id_vacante : number)  =>  {

    try{
       const postulaciones = await axios.post(`http://localhost:5000/getPostulacionesEnf` ,{id_user_enf , id_feria, id_vacante})
       //elemina la vacante de rxjs vacantes
       const enfpost = postulaciones.data
        return enfpost 

  }
  catch (error) {
      console.error('Error al cargar las postulaciones : ', error);
  
    }
  } 

  export const  aceptarPostulacion = async (id_postulacion :number,id_vacante :number ,id_user_fte : number )  =>  {
      
    try{
       const postulaciones = await axios.post(`http://localhost:5000/aceptarPostulacion` ,{id_postulacion,id_vacante,id_user_fte})
       //elemina la vacante de rxjs vacantes
       const enfpost = postulaciones.data

       if (enfpost.status === 200){

        console.log(enfpost);
       }else {
        console.log(enfpost);
        
       }

  }
  catch (error) {
      console.error('Error al cargar las postulaciones : ', error);
  
    }
  } 

  export const  rechazarPostulacion = async (id_postulacion :number,id_vacante: number, id_user_fte : number)  =>  {

    try{
       const postulaciones = await axios.post(`http://localhost:5000/rechazarPostulacion` ,{id_vacante,id_postulacion,id_user_fte})
       //elemina la vacante de rxjs vacantes
       const enfpost = postulaciones.data

       if (enfpost.status === 200){

        return enfpost
       }else {
        console.log(enfpost.status)
       }

  }
  catch (error) {
      console.error('Error al cargar las postulaciones : ', error);
  
    }
  } 



  
  export const  recargaStatus = async (id_feria : number)  =>  {

    try{
       const stado = await axios.post(`http://localhost:5000/recargaStatus` ,{id_feria})
       //elemina la vacante de rxjs vacantes
       const {estado} = stado.data
        return estado

  }
  catch (error) {
      console.error('Error al recargar la postulacion : ', error);
  
    }
  } 



