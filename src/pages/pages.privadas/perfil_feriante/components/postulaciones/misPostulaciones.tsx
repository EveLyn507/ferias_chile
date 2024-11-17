import { useEffect, useState } from "react"
import { MiPostuService } from "../../rxjs/rxjsMiPostulacion"
import { useSelector } from "react-redux"
import { AppStore } from "../../../../../redux/store"
import { Mispostulacion } from "../../../../models/interfaces"
import { Link } from "react-router-dom"

export const MisPostulaciones = () => {

const id_user_fte = useSelector((store : AppStore) => store.user.id_user )
const [misPost , setMisPost] = useState<Mispostulacion[]>([])
console.log(misPost);


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
    <div className="ferias">
    {misPost.map((mipost) => (
      <div className="card" key={mipost.id_postulacion}>
        <ul>
          <li> estado de su postulacion :{mipost.estado} </li>
          <li> feria :{mipost.nombre_feria}</li>
          <li>  trabajo : {mipost.rol} </li>
          <li> fecha de inicio :{mipost.fecha_ingreso} </li>
          <li> fecha de termino : {mipost.fecha_termino} </li>
          <Link to={`/private/2/postulaciones/supervisor/${mipost.id_feria}`}>SUPERVISOR</Link>
        </ul>
      </div>
    ))}
    </div>
    </>


  )
}