import { useEffect, useState } from "react";
import { vancanteService } from "../../../rxjs/sharingVacantes";
import { horarioVacante, vacante } from "../../../../../models/interfaces";
import { useParams } from "react-router-dom";
import {  updateVacanteFeria } from "../../../services/admin_feria_fuctions";

export const EmpleadosFeria = () => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria, 10) : 0;

  const [vacantes, setVacantes] = useState<vacante[]>([]);
  const [editStates, setEditStates] = useState<boolean[]>([]);

  useEffect(() => {
    const subscription = vancanteService.vacante$.subscribe((vacantes) => {
      setVacantes(vacantes);
      setEditStates(vacantes.map(() => false));
    });

    return () => subscription.unsubscribe();
  }, [idFeria]);

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


// Manejo de cambios en horarios (asegúrate de actualizar el índice correcto)
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

    
// Manejo de cambios en horarios (asegúrate de actualizar el índice correcto)
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

  const actualizarVacante = async (index: number , idFeria :number) => {
      updateVacanteFeria(vacantes[index], idFeria)
  }

  const borrarVacante = async (id_vacante: number) => {
    vancanteService.removeVacante(id_vacante);
  };
  return (
    <div className="ferias">
      {vacantes.map((formData, index) => (
        <div className="card" key={formData.id_vacante}>
          <ul>
          <li>
              <label>
                <strong>EMPLEADO :  {formData.id_user_fte}</strong>
              </label>
            </li>
            <li>
              <label>
                <strong>id_feria</strong>
                <input
                  type="number"
                  name="nombre_feria"
                  value={formData.id_feria}
                  readOnly={!editStates[index]}
                  onChange={(e) => handleChange(index, "id_feria", e.target.value)}
                />
              </label>
            </li>
            <li>
              <label>
                <strong>ingreso</strong>
                <input
                  type="date"
                  value={formData.ingreso}
                  readOnly={!editStates[index]}
                  onChange={(e) => handleChange(index, "ingreso", e.target.value)}
                />
              </label>
            </li>
            <li>
              <label>
                <strong>termino</strong>
                <input
                  type="date"
                  value={formData.termino}
                  readOnly={!editStates[index]}
                  onChange={(e) => handleChange(index, "termino", e.target.value)}
                />
              </label>
            </li>
            <div>
              {formData.horarios.map((horario, horarioIndex) => (
                <div className="ferias" key={horarioIndex}>
                  <li>
                  <select 
                id="id_dia" 
                name="id_dia"  
                value={horario.id_dia} 
                onChange={(e) => changeDiaHorario(index, horarioIndex , 'id_dia', e.target.value)} 
                required>
                <option value="0" disabled>Seleccione el día</option>
                <option value="1">Lunes</option>
                <option value="2">Martes</option> 
                <option value="3">Miercoles</option>
                <option value="4">Jueves</option> 
                <option value="5">Viernes</option>
                <option value="6">Sabado</option> 
                <option value="7">Domingo</option>
            </select>
                    <label>
                      <strong>hora inicio</strong>
                      <input
                        type="time"
                        value={horario.hora_entrada}
                        readOnly={!editStates[index]}
                        onChange={(e) => handleHorarioChange(index, horarioIndex ,"hora_entrada", e.target.value)}
                      />
                    </label>
                    <label>
                      <strong>hora termino</strong>
                      <input
                        type="time"
                        value={horario.hora_salida}
                        readOnly={!editStates[index]}
                        onChange={(e) => handleHorarioChange(index,horarioIndex, "hora_salida", e.target.value)}
                      />
                    </label>
                    </li>
                </div>
              ))}
            </div>
          </ul>
          <div className="button-group">
            {!editStates[index] ? (
              <button onClick={() => handleEdit(index)}>Actualizar</button>
            ) : (
              <button onClick={() => actualizarVacante(index, idFeria)}>Guardar Cambios</button>
            )}
            <button onClick={() => borrarVacante(formData.id_vacante)}>Eliminar Vacante</button>
          </div>
        </div>
      ))}
    </div>
  );
}
