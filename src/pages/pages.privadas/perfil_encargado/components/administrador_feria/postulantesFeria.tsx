/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { postulacionService } from "../../rxjs/sharingPostulaciones"
import { ftePostulacion, homeProps } from "../../../../models/interfaces"

import { aceptarPostulacion, rechazarPostulacion } from "../../services/admin_feria_fuctions"

export const PostulantesFeria = ({idFeria} : homeProps) =>{


const [postulaciones , setPostulacion] = useState<ftePostulacion[]>([])



useEffect(() => {

  const subscription = postulacionService.postulacion$.subscribe((postulacionesf) => {
    console.log("Postulaciones recibidas:", postulacionesf);
    setPostulacion(postulacionesf);

    console.log('id',idFeria);
    return () =>  subscription.unsubscribe();
 
});

}, []);



const aceptar = async (id_postulacion: number,id_vacante : number , id_user_fte : number) => {
    aceptarPostulacion(id_postulacion,id_vacante,id_user_fte)
}

const rechazar = async (id_postulacion: number,id_vacante : number , id_user_fte : number) => {
    rechazarPostulacion(id_postulacion,id_vacante,id_user_fte)
}


  


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

