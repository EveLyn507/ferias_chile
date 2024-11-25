import { useEffect, useState } from "react";
import { VacanteService } from "../../../rxjs/sharingVacantes";
import { homeProps, vacante } from "../../../../../models/interfaces";
import { updateVacanteFeria } from "../../../services/admin_feria_fuctions";
import VacanteCard from "./cardVacante";

export const EmpleadosFeria = ({ idFeria }: homeProps) => {
  const [vacantes, setVacantes] = useState<Map<number, vacante>>(new Map());
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const subscription = VacanteService.vacante$.subscribe((vacantes) => {
      setVacantes(vacantes);
    });

    return () => subscription.unsubscribe();
  }, [idFeria]);

  const validateVacante = (updatedVacante: vacante) => {
    if (!updatedVacante.ingreso || !updatedVacante.termino) {
      return "La vacante debe tener fechas válidas de ingreso y término.";
    }

    if (updatedVacante.ingreso >= updatedVacante.termino) {
      return "La fecha de ingreso debe ser anterior a la fecha de término.";
    }

    for (const horario of updatedVacante.horarios) {
      if (!horario.hora_entrada || !horario.hora_salida) {
        return "Todos los horarios deben tener horas de entrada y salida válidas.";
      }

      if (horario.hora_entrada >= horario.hora_salida) {
        return `En el día ${horario.id_dia}, la hora de entrada debe ser anterior a la hora de salida.`;
      }
    }

    return null; // No hay errores
  };

  const handleSaveVacante = (updatedVacante: vacante, id_feria: number) => {
    const error = validateVacante(updatedVacante);
    if (error) {
      setValidationError(error);
      setSuccessMessage(null);
      return;
    }

    setValidationError(null);
    setSuccessMessage("Vacante actualizada exitosamente.");
    updateVacanteFeria(updatedVacante, id_feria);

    setVacantes((prevVacantes) => {
      const updatedVacantes = new Map(prevVacantes);
      updatedVacantes.set(updatedVacante.id_vacante, updatedVacante);
      return updatedVacantes;
    });
  };

  const borrarVacante = async (id_vacante: number) => {
    VacanteService.removeVacante(id_vacante);
    setSuccessMessage("Vacante eliminada exitosamente.");
    setValidationError(null);
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
      {validationError && (
        <div style={{ color: "red", marginBottom: "10px" }}>{validationError}</div>
      )}
      {successMessage && (
        <div style={{ color: "green", marginBottom: "10px" }}>{successMessage}</div>
      )}

      {/* Vacantes con empleado asignado */}
      <div className="empleados">
        <h3>Mis empleados</h3>
        <div className="header-grilla">
          <span className="nombre-emp">Nombre</span>
          <span className="rol-emp">Rol</span>
          <span className="horarios">Horarios</span>
          <span className="ingreso">Ingreso</span>
          <span className="termino">Término</span>
        </div>
        {vacantesConEmpleado.map((formData) => (
          <VacanteCard
            key={formData.id_vacante}
            formData={formData}
            actualizarVacante={handleSaveVacante}
            borrarVacante={borrarVacante}
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
          <span className="termino">Término</span>
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
