/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { postulacionService } from "../../rxjs/sharingPostulaciones"
import { ftePostulacion } from "../../../../models/interfaces"
import { useParams } from "react-router-dom"
import { aceptarPostulacion, rechazarPostulacion } from "../../services/admin_feria_fuctions"

export const PostulantesFeria = () => {
const {id_feria} = useParams<{id_feria :string}>() 
const idFeria = id_feria ? parseInt(id_feria, 10) : 0

const [postulaciones , setPostulacion] = useState<ftePostulacion[]>([])


const cargaPostFilter = async(idFeria : number) => {
    await postulacionService.postulacionesFeriaFilter(idFeria)

   const subscription = postulacionService.postulacion$.subscribe((postulaciones) => {
    console.log("Postulaciones recibidas:", postulaciones);
    setPostulacion(postulaciones);
    return () => {
        subscription.unsubscribe();
    };
});
}



useEffect(() => {
  
    cargaPostFilter(idFeria)

}, []);



const aceptar = async (id_postulacion: number,id_vacante : number , id_user_fte : number) => {
    aceptarPostulacion(id_postulacion,id_vacante,id_user_fte)
}

const rechazar = async (id_postulacion: number,id_vacante : number , id_user_fte : number) => {
    rechazarPostulacion(id_postulacion,id_vacante,id_user_fte)
}

{postulaciones.map((postulacion) => {
    console.log(postulacion.fte_nombre, typeof postulacion.fte_nombre , typeof postulacion.id_vacante);

    // Rest of the code
  })}
  


return (
    <div className="ferias">
      {postulaciones.length > 0 ? (
        postulaciones.map((postulacion) => (
          <div className="card" key={postulacion.id_postulacion}>
            <ul>
              <li>Nombre: {postulacion.fte_nombre} {postulacion.fte_apellido} </li>
              <li>Id Vacante a la que aplica: {postulacion.id_vacante}</li>
              <li>Id Feria: {postulacion.id_feria}</li>
              <li>Id Usuario: {postulacion.id_user_fte}</li>
              <button onClick={() => aceptar(postulacion.id_postulacion,postulacion.id_vacante , postulacion.id_user_fte)}>Aceptar</button>
              <button onClick={() => rechazar(postulacion.id_postulacion,postulacion.id_vacante,postulacion.id_user_fte)}>Rechazar</button>
            </ul>
          </div>
        ))
      ) : (
        <p>Aun no hay postulantes</p>
      )}
    </div>
  );
  
}

