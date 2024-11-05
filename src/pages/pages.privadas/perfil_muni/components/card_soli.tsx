import { useEffect, useState } from "react";
import { solicitud } from "../../../models/interfaces";
import { solisaperService } from "../rxjs/soliaper";



export const Card_soli_muni = () => {

    const [solicitudes , setSolicitudes ] =useState<solicitud[]>([])
console.log(solicitudes);



useEffect(() => {
    const subscribe = solisaperService.sa$.subscribe((solicitudes) =>  setSolicitudes(solicitudes))

    return () => subscribe.unsubscribe()
})


  return (
    <>
        <div className="ferias">
            {solicitudes.map((solicitud,index) => (
                <div className="card" key={index}>
                    <ul>
                        <li> feria :  {solicitud.idFeria} </li>
                        <li> encargado mail  : {solicitud.encargadoMail} </li>
                        <li> estado solicitud : {solicitud.estado} </li>
             
                        <button>aceptar</button>
                        <button>rechazar</button>
       
                                
                    </ul>
                </div>
            ))}
        </div>
    </>
);


  
  
}