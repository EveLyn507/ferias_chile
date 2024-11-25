import { useEffect, useState } from "react";
import {  VacanteService } from "../../../rxjs/sharingVacantes";
import { homeProps, vacante } from "../../../../../models/interfaces";

import { updateVacanteFeria } from "../../../services/admin_feria_fuctions";
import VacanteCard from "./cardVacante";

export const EmpleadosFeria = ({ idFeria }: homeProps) => {

  // Cambiar estado de vacantes para que sea un Map
  const [vacantes, setVacantes] = useState<Map<number, vacante>>(new Map());

  useEffect(() => {
    const subscription = VacanteService.vacante$.subscribe((vacantes) => {
      setVacantes(vacantes);  // Actualizamos las vacantes del Map
    });

    return () => subscription.unsubscribe();
  }, [idFeria]);


  const handleSaveVacante = (updatedVacante: vacante, id_feria: number) => {
    // Crear una copia del Map y actualizar la vacante seleccionada
    updateVacanteFeria(updatedVacante , id_feria)
    setVacantes((prevVacantes) => {
      const updatedVacantes = new Map(prevVacantes);
      updatedVacantes.set(updatedVacante.id_vacante, updatedVacante); // Reemplaza la vacante
      return updatedVacantes;
    });
  };

  const borrarVacante = async (id_vacante: number) => {
    VacanteService.removeVacante(id_vacante);
  };

  // Filtrar vacantes donde id_user_fte es no nulo y nulo
  const vacantesConEmpleado = Array.from(vacantes.values()).filter(v => v.id_user_fte !== null);
  const vacantesSinEmpleado = Array.from(vacantes.values()).filter(v => v.id_user_fte === null);

  return (
    <div className="vacantes-container">
      {/* Vacantes con empleado asignado */}
      <div className="empleados">
        <h3>Mis empleados</h3>
        <div className="header-grilla">
            <span className="nombre-emp">Nombre</span>
            <span className="rol-emp">Rol</span>
            <span className="horarios">Horarios</span>
            <span className="ingreso">Ingreso</span>
            <span className="termino">Termino</span>
          </div>
        {vacantesConEmpleado.map((formData) => (
          <VacanteCard
            key={formData.id_vacante}
            formData={formData}
            actualizarVacante={handleSaveVacante}
            borrarVacante={ borrarVacante}
          />
        ))}
      </div>

      {/* Vacantes sin empleado asignado */}
      <div className="empy-vacante">
        <h3>Vacantes abiertas</h3>
        <div className="header-grilla">
            <span className="nombre-emp">Nombre</span>
            <span className="rol-emp">Rol</span>
            <span className="horarios">Horarios</span>
            <span className="ingreso">Ingreso</span>
            <span className="termino">Termino</span>
          </div>

        {vacantesSinEmpleado.map((formData) => (
          <VacanteCard
            key={formData.id_vacante}
            formData={formData}
            actualizarVacante={handleSaveVacante}
            borrarVacante={() => borrarVacante(formData.id_vacante)}
          />
        ))}
      </div>
    </div>
  );
};