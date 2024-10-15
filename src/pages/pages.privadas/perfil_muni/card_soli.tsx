import { soliProps } from "../../interfaces";



export const Card_soli_muni = ({solicitudes} : soliProps) => {


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