import React, { useState } from "react";
import { ftePostulacion, vacante } from "../../../../../models/interfaces";
import { DivHorario } from "./divHorario";
import { VacanteModal } from "./updateVacanteModal"; // Importa tu modal para editar vacantes
import { PostulacionModal } from "./postulacionModal";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../../redux/store";
import { getPostulacionesEnf } from "../../../services/admin_feria_fuctions";
import { useToast } from "../../../../../../components/ToastService";

interface VacanteCardProps {
  formData: vacante;
  actualizarVacante: (vacante: vacante, idFeria: number) => void;
  borrarVacante: (id_vacante: number) => void;
  id_feria: number;
}

const VacanteCard: React.FC<VacanteCardProps> = ({
  formData,
  actualizarVacante,
  borrarVacante,
  id_feria,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postuModalisOpen, setPostuModalOpen] = useState(false);
  const id_user_fte = useSelector((store: AppStore) => store.user.id_user);
  const [postulaciones, setPostulacion] = useState<ftePostulacion[] | null>(null);
  const [postIsCarga, setPostIsCarga] = useState<boolean>(false);
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const FectchPostu = async (id_user_enf: number, id_feria: number, id_vacante: number) => {
    try {
      const postulaciones = await getPostulacionesEnf(id_user_enf, id_feria, id_vacante);
      setPostulacion(postulaciones);
      setPostIsCarga(true);
    } catch (error) {
      console.error("Error al cargar las postulaciones:", error);
      addToast({ type: "error", message: "Error al cargar las postulaciones." });
    }
  };

  const PostuModalOpen = (id_vacante: number) => {
    setPostuModalOpen(true);
    FectchPostu(id_user_fte, id_feria, id_vacante);
  };

  const PostuModalClose = () => {
    setPostuModalOpen(false);
    setPostulacion(null);
    setPostIsCarga(false);
  };

  const handleVacanteUpdate = (updatedVacante: vacante, idFeria: number) => {
    try {
      if (!updatedVacante.ingreso || !updatedVacante.termino) {
        addToast({ type: "error", message: "Las fechas de ingreso y término son obligatorias." });
        return;
      }

      if (updatedVacante.ingreso >= updatedVacante.termino) {
        addToast({ type: "error", message: "La fecha de ingreso debe ser anterior a la fecha de término." });
        return;
      }

      for (const horario of updatedVacante.horarios) {
        if (!horario.hora_entrada || !horario.hora_salida) {
          addToast({ type: "error", message: "Todos los horarios deben incluir una hora de entrada y salida." });
          return;
        }

        if (horario.hora_entrada >= horario.hora_salida) {
          addToast({ type: "error", message: `La hora de entrada debe ser anterior a la hora de salida (${horario.id_dia}).` });
          return;
        }
      }

      actualizarVacante(updatedVacante, idFeria);
      addToast({ type: "success", message: "Vacante actualizada correctamente." });
      handleModalClose();
    } catch (error) {
      console.error("Error al actualizar la vacante:", error);
      addToast({ type: "error", message: "Ocurrió un error al actualizar la vacante." });
    }
  };

  const handleVacanteDelete = (id_vacante: number) => {
    try {
      borrarVacante(id_vacante);
      addToast({ type: "success", message: "Vacante eliminada correctamente." });
    } catch (error) {
      console.error("Error al eliminar la vacante:", error);
      addToast({ type: "error", message: "Ocurrió un error al eliminar la vacante." });
    }
  };

  return (
    <tbody className="card-vacante">
      <tr>
        <td className="nombre-emp">{formData.id_user_fte}</td>
        <td className="rol-emp">{formData.id_rol}</td>
        <td className="horario">
          <DivHorario horarios={formData.horarios} />
        </td>
        <td className="ingreso">{formData.ingreso}</td>
        <td className="termino">{formData.termino}</td>
        <td className="actions">
          <button onClick={handleModalOpen}>Actualizar</button>
          <button onClick={() => handleVacanteDelete(formData.id_vacante)}>Eliminar</button>
        </td>
        {!formData.id_user_fte && (
          <td>
            <button onClick={() => PostuModalOpen(formData.id_vacante)}>Postulantes</button>
          </td>
        )}
      </tr>
      <VacanteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        vacante={formData}
        onSave={handleVacanteUpdate}
      />
      {!formData.id_user_fte && (
        <PostulacionModal
          isOpen={postuModalisOpen}
          onClose={PostuModalClose}
          isCarga={postIsCarga}
          postulaciones={postulaciones}
        />
      )}
    </tbody>
  );
};

export default VacanteCard;
