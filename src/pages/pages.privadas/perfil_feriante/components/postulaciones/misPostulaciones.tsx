import { useEffect, useState } from "react"
import { MiPostuService } from "../../rxjs/rxjsMiPostulacion"
import { useSelector } from "react-redux"
import { AppStore } from "../../../../../redux/store"
import { Mispostulacion } from "../../../../models/interfaces"

export const MisPostulaciones = () => {

const id_user_fte = useSelector((store : AppStore) => store.user.id_user )
const [misPost , setMisPost] = useState<Mispostulacion[]>([])

const carga = async() => {
  MiPostuService.LoadMisPostulaciones(id_user_fte)
  const subscribe = MiPostuService.postulacion$.subscribe((postulacion) => {
    setMisPost(postulacion)
  }) 
  return () => subscribe.unsubscribe()
}
//carga y setea los post en la variable  misPost
useEffect(() =>{
  carga()

})


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

        </ul>
      </div>
    ))}
    </div>
    </>


  )
}