import { useEffect, useState } from "react";
import { VacanteService } from "../../../rxjs/sharingVacantes";
import {   homeProps, vacante } from "../../../../../models/interfaces";
import {   updateVacanteFeria } from "../../../services/admin_feria_fuctions";
import VacanteCard from "./cardVacante";

export const EmpleadosFeria = ({ idFeria }: homeProps) => {
  const [vacantes, setVacantes] = useState<Map<number, vacante>>(new Map());



  useEffect(() => {
    const subscription = VacanteService.vacante$.subscribe((vacantes) => {
      setVacantes(vacantes);
    });

    return () => subscription.unsubscribe();
  }, [idFeria]);



  const handleSaveVacante = (updatedVacante: vacante, id_feria: number) => {
    updateVacanteFeria(updatedVacante, id_feria);
    setVacantes((prevVacantes) => {
      const updatedVacantes = new Map(prevVacantes);
      updatedVacantes.set(updatedVacante.id_vacante, updatedVacante);
      return updatedVacantes;
    });
  };

  const borrarVacante = async (id_vacante: number) => {
    VacanteService.removeVacante(id_vacante);
  };

  const vacantesConEmpleado = Array.from(vacantes.values()).filter(
    (v) => v.id_user_fte !== null
  );
  const vacantesSinEmpleado = Array.from(vacantes.values()).filter(
    (v) => v.id_user_fte === null
  );







  return (
    <div className="vacantes-container">
      {/* Mostrar mensajes */}


      {/* Vacantes con empleado asignado */}
      <div className="empleados">
      <h3>Empleados</h3>
      <table className="data-table">
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
              borrarVacante={ borrarVacante}
              id_feria={idFeria}
            />
          ))}
  
        </table>
        </div>
      {/* Vacantes sin empleado asignado */}
      <div className="empy-vacante">
        <h3>Vacantes abiertas</h3>
        <table className="data-table">
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
            id_feria={idFeria}
          />
        ))}

      </table>
    </div>
    </div>
  );
};
