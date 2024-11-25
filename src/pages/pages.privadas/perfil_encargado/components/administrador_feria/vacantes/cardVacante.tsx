import React, { useState } from "react";
import { vacante } from "../../../../../models/interfaces";
import { DivHorario } from "./divHorario";
import { VacanteModal } from "./actualizarVacante";

interface VacanteCardProps {
  formData: vacante;
  actualizarVacante: (vacante: vacante, idFeria: number) => void;
  borrarVacante: (id_vacante: number) => void;
}

const VacanteCard: React.FC<VacanteCardProps> = ({
  formData,
  actualizarVacante,
  borrarVacante,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para manejar el mensaje de éxito
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para manejar el mensaje de error

  const handleModalOpen = () => {
    setIsModalOpen(true); // Abre el modal cuando se hace clic en "Actualizar"
    setSuccessMessage(null); // Limpia el mensaje de éxito al abrir el modal
    setErrorMessage(null); // Limpia el mensaje de error al abrir el modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Cierra el modal
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
    <div className="card-vacante">
      <span className="nombre-emp">{formData.id_user_fte}</span>
      <span className="rol-emp">{formData.id_rol}</span>

      <DivHorario horarios={formData.horarios} />
      <span className="ingreso">{formData.ingreso}</span>
      <span className="termino">{formData.termino}</span>

      {/* Botón para abrir el modal */}
      <button onClick={handleModalOpen}>Actualizar</button>

      {/* Botón para eliminar vacante */}
      <button onClick={() => borrarVacante(formData.id_vacante)}>Eliminar Vacante</button>

      {/* Mensaje de éxito */}
      {successMessage && (
        <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
      )}

      {/* Mensaje de error */}
      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
      )}

      {/* Modal de edición */}
      <VacanteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        vacante={formData} // Pasa la vacante para editarla
        onSave={handleVacanteUpdate} // Maneja la actualización
      />
    </div>
  );
};

export default VacanteCard;
