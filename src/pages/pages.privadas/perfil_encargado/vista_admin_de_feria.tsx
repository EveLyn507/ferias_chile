
import { DatosBanco } from "./components/administrador_feria/datosBank"
import BooleanDaysSelector from "./components/administrador_feria/programacion"


export const Admin_de_feria = () => {
  return (

    <> 
        <div>aca estaran las opciones para administracion</div>


        <h2>  programacion de la feria  </h2>
        
        <h3>Elige los dias en que la feria estara disponible</h3>
        <BooleanDaysSelector/>

              
      <div>
  
      <DatosBanco/>

      </div>

        <h2>  detalle de la feria </h2>
    
    </>



  )
}