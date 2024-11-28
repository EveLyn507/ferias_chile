import {  useEffect, useState } from "react"
import { postulacion } from "../../../../../models/interfaces"
import { insertPostulacion } from "../../../services/postulacionesFunction"
import { useSelector } from "react-redux"
import  { AppStore } from "../../../../../../redux/store"
import Modal from 'react-modal'
import { vacantePostular } from "../interfaces"
import './postuModal.css'
import { DivHorario } from "./divHorario"
interface modalProps {
    isOpen: boolean
    onClose: () => void
    vacantes: vacantePostular[]
    nombre_f : string | null
}

Modal.setAppElement('#root')

export const FteModalPostulaciones = ({ isOpen, vacantes , onClose , nombre_f} : modalProps) => {
const rol = ['none' , 'supervisor', 'ayudante']
const id_user_fte = useSelector((store : AppStore) => store.user.id_user)
const mail = useSelector((store : AppStore) => store.user.email)


useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Limpieza para restaurar el scroll
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

const [postulacion, setPostulacion] = useState<postulacion>({
    id_user_fte : id_user_fte,
    user_mail : mail,
    id_vacante : null,
    
})


const postular = async (id_vacante: number) => {
    // Actualiza el estado de la postulacion
    const nuevaPostulacion = { ...postulacion, id_vacante: id_vacante };
    setPostulacion(nuevaPostulacion); // Actualiza el estado

    // Llama a insertPostulacion después de actualizar el estado
    await insertPostulacion(nuevaPostulacion);

    // Restablece la id_vacante a null
    setPostulacion({ ...nuevaPostulacion, id_vacante: null });
};


    return (

        <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "10px",
            width: "600px",
            height: "60%",
            overflow: "auto",
          },
        }}
      >
        
        <div className="vacantes">
            <span>Vancantes libres en <strong>{nombre_f}</strong></span>
            {vacantes.map((vacante) => (
                <div className="vacante-content" key={vacante.id_vacante}>

                    <ul>
                        <h3>Rol : {rol[vacante.id_rol]}</h3>
                        <li> FECHA INGRESO : {vacante.ingreso}</li>
                        <li> FECHA DE TERMINO : {vacante.termino}</li>
                    </ul> 
          
                    <h3>HORARIOS</h3>
                    <div className="horario">
                
                        <DivHorario horarios={vacante.horarios}/>
                   
                        </div>
                    <button onClick={() => postular(vacante.id_vacante)}>POSTULAR</button>       
                </div>
                
            ))}
       
        </div>
        </Modal>
    )


}