import React, { useState } from "react";
import { ftePostulacion, vacante } from "../../../../../models/interfaces";
import { DivHorario } from "./divHorario";
import { VacanteModal } from "./vacanteModal"; // Importa tu modal para editar vacantes
import { PostulacionModal } from "./postulacionModal";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../../redux/store";
import { getPostulacionesEnf } from "../../../services/admin_feria_fuctions";

interface VacanteCardProps {
  formData: vacante;
  actualizarVacante: (vacante: vacante, idFeria: number) => void;
  borrarVacante: (id_vacante: number) => void;
  id_feria : number
}

const VacanteCard: React.FC<VacanteCardProps> = ({
  formData,
  actualizarVacante,
  borrarVacante,
  id_feria
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal
  const [, setSuccessMessage] = useState<string | null>(null); // Estado para manejar el mensaje de éxito
  const [, setErrorMessage] = useState<string | null>(null); // Estado para manejar el mensaje de error
  const [postuModalisOpen , setPostuModalOpen] = useState(false);
  const id_user_fte = useSelector((store: AppStore) => store.user.id_user)
  const [postulaciones, setPostulacion] = useState<ftePostulacion[] | null>(null)
  const[postIsCarga, setPostIsCarga] = useState<boolean>(false)
  const handleModalOpen = () => {
    setIsModalOpen(true); // Abre el modal cuando se hace clic en "Actualizar"
    setSuccessMessage(null); // Limpia el mensaje de éxito al abrir el modal
    setErrorMessage(null); // Limpia el mensaje de error al abrir el modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Cierra el modal
  };



  const FectchPostu = async(id_user_enf : number , id_feria : number , id_vacante : number) => {
    getPostulacionesEnf(id_user_enf , id_feria, id_vacante).then(postulaciones => {
      setPostulacion(postulaciones); // Actualiza la lista con los datos obtenidos
      setPostIsCarga(true)
    }).catch(error => {
        console.error("Error al cargar las vacantes:", error);
    });

}    


  const PostuModalOpen = (id_vacante : number) => {
    setPostuModalOpen(true); // Abre el modal cuando se hace clic en "Actualizar"
    FectchPostu(id_user_fte, id_feria , id_vacante)
  };

  const PostuModalClose = () => {
    setPostuModalOpen(false); // Cierra el modal
    setPostulacion(null)
    setPostIsCarga(false)
  };



  const handleVacanteUpdate = (updatedVacante: vacante, idFeria: number) => {
    try {
      // Validaciones básicas
      if (!updatedVacante.ingreso || !updatedVacante.termino) {
        setErrorMessage("Las fechas de ingreso y término son obligatorias.");
        return;
      }

      if (updatedVacante.ingreso >= updatedVacante.termino) {
        setErrorMessage("La fecha de ingreso debe ser anterior a la fecha de término.");
        return;
      }

      for (const horario of updatedVacante.horarios) {
        if (!horario.hora_entrada || !horario.hora_salida) {
          setErrorMessage("Todos los horarios deben incluir una hora de entrada y salida.");
          return;
        }

        if (horario.hora_entrada >= horario.hora_salida) {
          setErrorMessage(
            `La hora de entrada debe ser anterior a la hora de salida (${horario.id_dia}).`
          );
          return;
        }
      }

      // Llama la función de actualización proporcionada
      actualizarVacante(updatedVacante, idFeria);
      setErrorMessage(null); // Limpia cualquier error previo
      setSuccessMessage("La vacante ha sido actualizada exitosamente.");
      handleModalClose(); // Cierra el modal después de guardar
    } catch (error) {
      console.error("Error al actualizar la vacante:", error);
      setErrorMessage("Ocurrió un error al actualizar la vacante. Intenta nuevamente.");
    }
  };

  return (
    <tbody className="card-vacante">
      <td className="nombre-emp">{formData.id_user_fte}</td>
      <td className="rol-emp">{formData.id_rol}</td>
      <td className="horario">
      <DivHorario horarios={formData.horarios} />
      </td>
      <td className="ingreso">{formData.ingreso}</td>
      <td className="termino">{formData.termino}</td>

     <td>
      <button onClick={handleModalOpen}>Actualizar</button>
      <button onClick={() => borrarVacante(formData.id_vacante)}>Eliminar </button>
      </td>
        {!formData.id_user_fte &&  <td><button onClick={() => PostuModalOpen(formData.id_vacante)}>Postulantes</button></td>}

      <VacanteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        vacante={formData} // Pasa la vacante para editarla
        onSave={handleVacanteUpdate} // Maneja la actualización
      />
      {!formData.id_user_fte && 
          <PostulacionModal
          isOpen={postuModalisOpen}
          onClose={PostuModalClose}
          isCarga = {postIsCarga}
          postulaciones ={postulaciones}
          />
      }
   
    </tbody>
  );
};

export default VacanteCard;
