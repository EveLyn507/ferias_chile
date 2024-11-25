import React, { useState } from "react";
import { vacante } from "../../../../../models/interfaces";
import { DivHorario } from "./divHorario";
import { VacanteModal } from "./actualizarVacante"; // Importa tu modal para editar vacantes

interface VacanteCardProps {
  formData: vacante;
  actualizarVacante: (vacante: vacante,  idFeria: number) => void;
  borrarVacante: (id_vacante: number) => void;
  
}

const VacanteCard: React.FC<VacanteCardProps> = ({
  formData,
  actualizarVacante,
  borrarVacante,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal

  const handleModalOpen = () => {
    setIsModalOpen(true); // Abre el modal cuando se hace clic en "Actualizar"
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Cierra el modal
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

      {/* Modal de edición */}
      <VacanteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        vacante={formData} // Pasa la vacante para editarla
        onSave={actualizarVacante}
      />
    </div>
  );
};

export default VacanteCard;
