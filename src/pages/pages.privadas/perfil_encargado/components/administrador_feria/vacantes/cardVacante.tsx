import React, { useState } from "react";
import { vacante } from "../../../../../models/interfaces";
import { DivHorario } from "./divHorario";
import { VacanteModal } from "./vacanteModal"; // Importa tu modal para editar vacantes

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
      <VacanteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        vacante={formData} // Pasa la vacante para editarla
        onSave={actualizarVacante}
      />
    </tbody>
  );
};

export default VacanteCard;
