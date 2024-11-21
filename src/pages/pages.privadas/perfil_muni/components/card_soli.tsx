import { useEffect, useState } from "react";
import { solicitud } from "../../../models/interfaces";
import { solisaperService } from "../rxjs/soliaper";
import { confirmSoli, declineSoli } from "../services/traer_soli_municipal";



export const Card_soli_muni = () => {

    const [solicitudes , setSolicitudes ] =useState<solicitud[]>([])
console.log(solicitudes);



useEffect(() => {
    const subscribe = solisaperService.sa$.subscribe((solicitudes) =>  setSolicitudes(solicitudes))

    return () => subscribe.unsubscribe()
})

console.log(solicitudes);

  return (
    <>
        <div className="ferias">
            {solicitudes.map((solicitud,index) => (
                <div className="card" key={solicitud.id_solicitud}>
                    <ul>
                    <li> solicitante  : {solicitud.nombre_solicitante} </li>
                    <li> correo del solicitante : {solicitud.enf_mail} </li>
                    <li> telefono del solicitante  : {solicitud.enf_fono} </li>
                    <li> feria solicitada :  {solicitud.nombre_feria} </li>
                    <li> estado solicitud : {solicitud.estado} </li>
        
                <button onClick={() => confirmSoli(index ,solicitud.id_solicitud,solicitud.id_feria)}>aceptar</button>
                <button onClick={() => declineSoli(index,solicitud.id_solicitud,solicitud.id_feria)}>rechazar</button>
 
                                
                    </ul>
                </div>
            ))}
        </div>
    </>
);

  
}