
import { Link } from "react-router-dom"
import TraerEncargadoFerias from "./components/ferias_d_encargado/traer_ferias_encargado"
import { PrivateRoutes } from "../../../models"



 const PerfilEn = () => {
  return (

    <>


     <h1>PERFIL ENCARGADO DE LAS FERIAS</h1>
       
      <div>
      <TraerEncargadoFerias/>
      
      </div>
      <li> <Link to={`${PrivateRoutes.BANCOS}`} >BANCOS</Link></li>



    </>



  )
}


export default  PerfilEn