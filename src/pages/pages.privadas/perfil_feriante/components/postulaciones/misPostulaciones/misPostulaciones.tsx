import { useEffect, useState } from "react"
import { MiPostuService } from "../../../rxjs/rxjsMiPostulacion"
import { useSelector } from "react-redux"
import { AppStore } from "../../../../../../redux/store"
import { Mispostulacion } from "../../../../../models/interfaces"
import { Link } from "react-router-dom"
import './misPostulaciones.css'
export const MisPostulaciones = () => {

const id_user_fte = useSelector((store : AppStore) => store.user.id_user )
const [misPost , setMisPost] = useState<Mispostulacion[]>([])



//carga y setea los post en la variable  misPost
useEffect(() =>{
  MiPostuService.LoadMisPostulaciones(id_user_fte)
  const carga = async() => {
    const subscribe = MiPostuService.postulacion$.subscribe((postulacion) => {
      setMisPost(postulacion)
    }) 
    return () => subscribe.unsubscribe()
  }
 carga()

},[])

 
  return (
    
    <>
    <div className="mis-post">
    {misPost.map((mipost) => (
      <div className="postulacion-content" key={mipost.id_postulacion}>
  
          <span> Estado de su postulacion: {mipost.estado} </span>
          <span> Feria: {mipost.nombre_feria}</span>
          <span> Rol: {mipost.rol} </span>
          <span> Fecha de inicio: {mipost.fecha_ingreso} </span>
          <span> Fecha de termino: {mipost.fecha_termino} </span>
          <Link to={`/private/2/supervisor/${mipost.id_feria}/${mipost.nombre_feria}`}>SUPERVISOR</Link>
   
      </div>
    ))}
    </div>
    </>


  )
}