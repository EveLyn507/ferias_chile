import { useState } from "react";
import { horarioVacante, vacante } from "../../../../../models/interfaces";
import { saveVacanteFeria } from "../../../services/admin_feria_fuctions";
import { useParams } from "react-router-dom";
import { NewHorario } from "./newHorario";

export const CrearVacante = () => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria, 10) : 0;

  const [rol, setRol] = useState('');
  const semana = ['none', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const [horarios, setHorarios] = useState<horarioVacante[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const saveHorario = async (newHorario: horarioVacante) => {
    setHorarios([...horarios, newHorario]);
  };

  const todayISO = new Date().toISOString().split('T')[0];

  const guardarVacante = async () => {
    const newWarnings: string[] = [];

    if (horarios.length === 0) {
      newWarnings.push("Debe agregar al menos un horario.");
    }
    if (rol === '') {
      newWarnings.push("Debe seleccionar un rol.");
    }

    if (newWarnings.length > 0) {
      setWarnings(newWarnings);
      setSuccessMessage(null); // Limpiar mensaje de éxito si hay errores
      return;
    }

    const vacante: vacante = {
      id_vacante: 0,
      id_user_fte: null,
      id_feria: idFeria,
      id_rol: parseInt(rol),
      ingreso: todayISO,
      termino: todayISO,
      id_estado_vacante: 1,
      horarios: horarios
    };

    try {
      await saveVacanteFeria(vacante);

      setRol('');
      setHorarios([]);
      setWarnings([]);
      setSuccessMessage("Vacante creada exitosamente."); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al crear la vacante:", error);
      setWarnings(["Ocurrió un error al crear la vacante."]);
      setSuccessMessage(null); // Limpiar mensaje de éxito si hay errores
    }
  };

  const eliminarHorario = async (id_dia: number) => {
    const updatedHorarios = horarios.filter(b => b.id_dia !== id_dia);
    setHorarios(updatedHorarios);
  };

  return (
    <>
      <h2>CREAR NUEVA VACANTE</h2>
      <div>
        <div>
          <select
            id="role"
            name="role"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="" disabled>Seleccione un rol</option>
            <option value="1">Supervisor</option>
            <option value="2">Ayudante</option>
          </select>
          <div>
            <NewHorario saveHorario={saveHorario} />
          </div>
        </div>

        <div>
          {horarios.map((horario, index) => (
            <div className="ferias" key={index}>
              <strong>{semana[horario.id_dia]} de {horario.hora_entrada} a {horario.hora_salida}</strong>
              <button onClick={() => eliminarHorario(horario.id_dia)}>Eliminar Horario</button>
            </div>
          ))}
        </div>

        {warnings.length > 0 && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {warnings.map((warning, index) => (
              <p key={index}>{warning}</p>
            ))}
          </div>
        )}

        {successMessage && (
          <div style={{ color: "green", marginTop: "10px" }}>
            <p>{successMessage}</p>
          </div>
        )}

        <button onClick={guardarVacante}>Agregar Vacante</button>
      </div>
    </>
  );
};
