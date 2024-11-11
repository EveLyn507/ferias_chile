/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom"
import { PrivateRoutes } from "../../../models"
import { Card_feria_encargado } from "./components/ferias_d_encargado/card_feria_encargado"
import { useEffect } from "react"
import { feriasService } from "./rxjs/sharingFeriasEn"
import { useSelector } from "react-redux"
import  { AppStore } from "../../../redux/store"



 const PerfilEn = () => {

const id_user_enf = useSelector((store : AppStore) => store.user.id_user)

useEffect(() => {
  feriasService.loadInitialData(id_user_enf)

},[])

  return (
    
    <>


     <h1>PERFIL ENCARGADO DE LAS FERIAS</h1>
       
      <div>
      <Card_feria_encargado />
      
      </div>
      <li> <Link to={`${PrivateRoutes.BANCOS}`} >BANCOS</Link></li>

      <li> <Link to="TEAM" >EMPLEADOS </Link></li>

    </>



  )
}


export default  PerfilEn