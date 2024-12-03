import { useEffect, useState } from "react";
import { VacanteService } from "../../../rxjs/sharingVacantes";
import { homeProps, vacante } from "../../../../../models/interfaces";
import { deleteVacante, updateVacanteFeria } from "../../../services/admin_feria_fuctions";
import VacanteCard from "./cardVacante";
import { CrearVacanteModal } from "./newVacante/newVacanteModal";
import { useToast } from "@components/ToastService"; // Usando alias para importar ToastService

export const EmpleadosFeria = ({ id_feria }: homeProps) => {
  const [vacantes, setVacantes] = useState<Map<number, vacante>>(new Map());
  const [newVacantIsOpen, setNewVacantIsOpen] = useState<boolean>(false);
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  useEffect(() => {
    const subscription = VacanteService.vacante$.subscribe((vacantes) => {
      setVacantes(vacantes);
    });

    return () => subscription.unsubscribe();
  }, [id_feria]);

  const newVacantOpen = () => {
    setNewVacantIsOpen(true);
  };

  const newVacantClose = () => {
    setNewVacantIsOpen(false);
  };

  const handleSaveVacante = (updatedVacante: vacante, id_feria: number) => {
    try {
      updateVacanteFeria(updatedVacante, id_feria);
      setVacantes((prevVacantes) => {
        const updatedVacantes = new Map(prevVacantes);
        updatedVacantes.set(updatedVacante.id_vacante, updatedVacante);
        return updatedVacantes;
      });
      addToast({ type: "success", message: "Vacante actualizada correctamente." });
    } catch (error) {
      console.error("Error al actualizar la vacante:", error);
      addToast({ type: "error", message: "Error al actualizar la vacante." });
    }
  };

  const borrarVacante = async (id_vacante: number) => {
    try {
      await deleteVacante(id_vacante);
      setVacantes((prevVacantes) => {
        const updatedVacantes = new Map(prevVacantes);
        updatedVacantes.delete(id_vacante);
        return updatedVacantes;
      });
      addToast({ type: "success", message: "Vacante eliminada correctamente." });
    } catch (error) {
      console.error("Error al eliminar la vacante:", error);
      addToast({ type: "error", message: "Error al eliminar la vacante." });
    }
  };

  const vacantesConEmpleado = Array.from(vacantes.values()).filter(
    (v) => v.id_user_fte !== null
  );

  const vacantesSinEmpleado = Array.from(vacantes.values()).filter(
    (v) => v.id_user_fte === null
  );

  return (
    <div className="vacantes-container">
      <div className="empleados">
        <button onClick={newVacantOpen}>Crear Vacante</button>
        <CrearVacanteModal isOpen={newVacantIsOpen} id_feria={id_feria} onClose={newVacantClose} />

        <h3>Empleados</h3>
        <table className="vacante-table">
          <thead>
            <tr>
              <th>Nombre Empleado</th>
              <th>Rol</th>
              <th className="horario">Horario</th>
              <th>Ingreso</th>
              <th>Término</th>
              <th>Acciones</th>
            </tr>
          </thead>
          {vacantesConEmpleado.map((formData) => (
            <VacanteCard
              key={formData.id_vacante}
              formData={formData}
              actualizarVacante={handleSaveVacante}
              borrarVacante={borrarVacante}
              id_feria={id_feria}
            />
          ))}
        </table>
      </div>

      <div className="empy-vacante">
        <h3>Vacantes abiertas</h3>
        <table className="vacante-table">
          <thead>
            <tr>
              <th>Nombre Empleado</th>
              <th>Rol</th>
              <th className="horario">Horario</th>
              <th>Ingreso</th>
              <th>Término</th>
              <th>Acciones</th>
              <th>Postulantes</th>
            </tr>
          </thead>
          {vacantesSinEmpleado.map((formData) => (
            <VacanteCard
              key={formData.id_vacante}
              formData={formData}
              actualizarVacante={handleSaveVacante}
              borrarVacante={() => borrarVacante(formData.id_vacante)}
              id_feria={id_feria}
            />
          ))}
        </table>
      </div>
    </div>
  );
};
