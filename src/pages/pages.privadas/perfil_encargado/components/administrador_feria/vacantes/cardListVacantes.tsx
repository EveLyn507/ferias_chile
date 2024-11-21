import { useEffect, useState } from "react";
import { vancanteService } from "../../../rxjs/sharingVacantes";
import { horarioVacante, vacante } from "../../../../../models/interfaces";
import { useParams } from "react-router-dom";
import { updateVacanteFeria } from "../../../services/admin_feria_fuctions";

export const EmpleadosFeria = () => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria, 10) : 0;

  const [vacantes, setVacantes] = useState<vacante[]>([]);
  const [editStates, setEditStates] = useState<boolean[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const subscription = vancanteService.vacante$.subscribe((vacantes) => {
      setVacantes(vacantes);
      setEditStates(vacantes.map(() => false));
    });

    return () => subscription.unsubscribe();
  }, [idFeria]);

  const validateVacante = (vacante: vacante) => {
    const errors: string[] = [];
    if (!vacante.ingreso || !vacante.termino) {
      errors.push(`La vacante con ID ${vacante.id_vacante} debe tener una fecha de ingreso y término.`);
    }
    if (vacante.ingreso >= vacante.termino) {
      errors.push(`La fecha de ingreso debe ser anterior a la fecha de término en la vacante con ID ${vacante.id_vacante}.`);
    }
    vacante.horarios.forEach((horario, index) => {
      if (!horario.hora_entrada || !horario.hora_salida) {
        errors.push(`El horario ${index + 1} de la vacante con ID ${vacante.id_vacante} está incompleto.`);
      }
      if (horario.hora_entrada >= horario.hora_salida) {
        errors.push(`La hora de entrada debe ser anterior a la hora de salida en el horario ${index + 1} de la vacante con ID ${vacante.id_vacante}.`);
      }
    });
    return errors;
  };

  const handleEdit = (index: number) => {
    setEditStates((prev) => prev.map((editState, i) => (i === index ? true : editState)));
  };

  const handleChange = (index: number, field: keyof vacante, value: string) => {
    setVacantes((prevDataList) =>
      prevDataList.map((formData, i) =>
        i === index ? { ...formData, [field]: value } : formData
      )
    );
  };

  const changeDiaHorario = (index: number, horarioIndex: number, field: keyof horarioVacante, value: string) => {
    setVacantes((prevDataList) =>
      prevDataList.map((formData, i) => {
        if (i === index) {
          const updatedHorarios = formData.horarios.map((horario, j) =>
            j === horarioIndex ? { ...horario, [field]: parseInt(value) } : horario
          );
          return { ...formData, horarios: updatedHorarios };
        }
        return formData;
      })
    );
  };

  const handleHorarioChange = (index: number, horarioIndex: number, field: keyof horarioVacante, value: string) => {
    setVacantes((prevDataList) =>
      prevDataList.map((formData, i) => {
        if (i === index) {
          const updatedHorarios = formData.horarios.map((horario, j) =>
            j === horarioIndex ? { ...horario, [field]: value } : horario
          );
          return { ...formData, horarios: updatedHorarios };
        }
        return formData;
      })
    );
  };

  const actualizarVacante = async (index: number, idFeria: number) => {
    const vacante = vacantes[index];
    const errors = validateVacante(vacante);

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await updateVacanteFeria(vacante, idFeria);
      setEditStates((prev) => prev.map((editState, i) => (i === index ? false : editState)));
      setValidationErrors([]); // Limpiar errores después de una acción exitosa
    } catch (error) {
      console.error("Error al actualizar la vacante:", error);
      setValidationErrors([`Error al actualizar la vacante con ID ${vacante.id_vacante}.`]);
    }
  };

  const borrarVacante = async (id_vacante: number) => {
    try {
      await vancanteService.removeVacante(id_vacante);
      setValidationErrors([]); // Limpiar errores después de una acción exitosa
    } catch (error) {
      console.error("Error al borrar la vacante:", error);
      setValidationErrors([`Error al borrar la vacante con ID ${id_vacante}.`]);
    }
  };

  return (
    <div className="empleados-feria">
    {validationErrors.length > 0 && (
      <div className="empleados-feria-error" style={{ color: "red", marginBottom: "10px" }}>
        {validationErrors.map((error, index) => (
          <p key={index} className="empleados-feria-error-item">
            {error}
          </p>
        ))}
      </div>
    )}
    {vacantes.map((formData, index) => (
      <div className="empleado-card" key={formData.id_vacante}>
        <ul className="empleado-info">
          <li className="empleado-info-item">
            <label className="empleado-info-label">
              <strong>EMPLEADO: {formData.id_user_fte}</strong>
            </label>
          </li>
          <li className="empleado-info-item">
            <label className="empleado-info-label">
              <strong>id_feria</strong>
              <input
                type="number"
                className="empleado-input"
                value={formData.id_feria}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "id_feria", e.target.value)}
              />
            </label>
          </li>
          <li className="empleado-info-item">
            <label className="empleado-info-label">
              <strong>ingreso</strong>
              <input
                type="date"
                className="empleado-input"
                value={formData.ingreso}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "ingreso", e.target.value)}
              />
            </label>
          </li>
          <li className="empleado-info-item">
            <label className="empleado-info-label">
              <strong>termino</strong>
              <input
                type="date"
                className="empleado-input"
                value={formData.termino}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "termino", e.target.value)}
              />
            </label>
          </li>
          <div className="empleado-horarios">
            {formData.horarios.map((horario, horarioIndex) => (
              <div className="empleado-horario-item" key={horarioIndex}>
                <li className="empleado-horario-info">
                  <select
                    className="empleado-horario-select"
                    id="id_dia"
                    value={horario.id_dia}
                    onChange={(e) => changeDiaHorario(index, horarioIndex, "id_dia", e.target.value)}
                    required
                  >
                    <option value="0" disabled>Seleccione el día</option>
                    <option value="1">Lunes</option>
                    <option value="2">Martes</option>
                    <option value="3">Miércoles</option>
                    <option value="4">Jueves</option>
                    <option value="5">Viernes</option>
                    <option value="6">Sábado</option>
                    <option value="7">Domingo</option>
                  </select>
                  <label className="empleado-horario-label">
                    <strong>hora inicio</strong>
                    <input
                      type="time"
                      className="empleado-horario-input"
                      value={horario.hora_entrada}
                      readOnly={!editStates[index]}
                      onChange={(e) => handleHorarioChange(index, horarioIndex, "hora_entrada", e.target.value)}
                    />
                  </label>
                  <label className="empleado-horario-label">
                    <strong>hora término</strong>
                    <input
                      type="time"
                      className="empleado-horario-input"
                      value={horario.hora_salida}
                      readOnly={!editStates[index]}
                      onChange={(e) => handleHorarioChange(index, horarioIndex, "hora_salida", e.target.value)}
                    />
                  </label>
                </li>
              </div>
            ))}
          </div>
        </ul>
        <div className="empleado-actions">
          {!editStates[index] ? (
            <button className="empleado-edit-btn" onClick={() => handleEdit(index)}>
              Actualizar
            </button>
          ) : (
            <button className="empleado-save-btn" onClick={() => actualizarVacante(index, idFeria)}>
              Guardar Cambios
            </button>
          )}
          <button className="empleado-delete-btn" onClick={() => borrarVacante(formData.id_vacante)}>
            Eliminar Vacante
          </button>
        </div>
      </div>
    ))}
  </div>
  
  );
};
