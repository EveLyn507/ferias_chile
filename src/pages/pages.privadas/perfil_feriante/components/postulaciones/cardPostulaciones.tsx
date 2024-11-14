import { useEffect, useState } from "react"
import { postulacionService } from "../../rxjs/rxjsPostulaciones"
import { postulacion, vacante } from "../../../../models/interfaces"
import { insertPostulacion } from "../../services/postulacionesFunction"
import { useSelector } from "react-redux"
import  { AppStore } from "../../../../../redux/store"

export const CardPostulaciones = () => {

const [VacantesUp , setVacatesUp] = useState<vacante[]>([])
const semana = ['none', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const rol = ['none' , 'supervisor', 'ayudante']
const id_user_fte = useSelector((store : AppStore) => store.user.id_user)
const mail = useSelector((store : AppStore) => store.user.email)


const [postulacion, setPostulacion] = useState<postulacion>({
    id_user_fte : id_user_fte,
    user_mail : mail,
    id_vacante : null,
    
})

useEffect(() => {
 const subscription = postulacionService.vacante$.subscribe((vacantes) => {
setVacatesUp(vacantes)
 })
    return () => subscription.unsubscribe();
},[])

const postular = async (id_vacante: number) => {
    // Actualiza el estado de la postulacion
    const nuevaPostulacion = { ...postulacion, id_vacante: id_vacante };
    setPostulacion(nuevaPostulacion); // Actualiza el estado

    // Llama a insertPostulacion después de actualizar el estado
    await insertPostulacion(nuevaPostulacion);

    // Restablece la id_vacante a null
    setPostulacion({ ...nuevaPostulacion, id_vacante: null });
};



console.log(VacantesUp);

    return (
        <div className="ferias">
            {VacantesUp.map((vacante) => (
                <div className="card" key={vacante.id_vacante}>

                    <ul>
                        <li>FERIA : {vacante.id_feria}</li>
                        <h3>Rol : {rol[vacante.id_rol]}</h3>
                        <li> FECHA INGRESO : {vacante.ingreso}</li>
                        <li> FECHA DE TERMINO : {vacante.termino}</li>
                    </ul> 
                    <h3>HORARIOS</h3>
                    <div>
                     {vacante.horarios.map((horario) => (
                        <div key={horario.id_detalle_horario}>
                         
                        <ul>
                            <li>DIA  {semana[horario.id_dia]} DE {horario.hora_entrada} A {horario.hora_salida} </li>
                      
                        </ul>
                        </div>

                     ) )}
                    
                    </div>      
                    <button onClick={() => postular(vacante.id_vacante)}>POSTULAR</button>       
                </div>
                
            ))}
       
        </div>
    )


}