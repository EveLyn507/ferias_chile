import { useState } from "react";
import { horarioVacante, vacante } from "../../../../../models/interfaces";
import { saveVacanteFeria } from "../../../services/admin_feria_fuctions";
import { useParams } from "react-router-dom";
import { NewHorario } from "./newHorario";

export const CrearVacante = () => {
  // Variables de URL o Redux
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria, 10) : 0;

  // Variables internas
  const [rol, setRol] = useState('');
  const semana = ['none', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const [horarios, setHorarios] = useState<horarioVacante[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]); // Mensajes de advertencia

  // Funciones del componente hijo -> NewHorario
  const saveHorario = (newHorario: horarioVacante) => {
    // Validación para evitar horarios duplicados en el mismo día
    if (horarios.some(h => h.id_dia === newHorario.id_dia)) {
      setWarnings([...warnings, `Ya existe un horario para ${semana[newHorario.id_dia]}.`]);
      return;
    }
    setHorarios([...horarios, newHorario]);
    setWarnings([]); // Limpiar advertencias si todo está correcto
  };

  const todayISO = new Date().toISOString().split('T')[0];

  const validarHorarios = () => {
    const newWarnings: string[] = [];

    // Validar que haya al menos un horario
    if (horarios.length === 0) {
      newWarnings.push("Debe agregar al menos un horario.");
    }

    // Validar que cada horario tenga horas válidas
    horarios.forEach((horario, index) => {
      if (!horario.hora_entrada || !horario.hora_salida) {
        newWarnings.push(`El horario ${index + 1} está incompleto.`);
      }
      if (horario.hora_entrada >= horario.hora_salida) {
        newWarnings.push(`La hora de inicio debe ser anterior a la hora de término en el horario ${index + 1}.`);
      }
    });

    return newWarnings;
  };

  const guardarVacante = async () => {
    const newWarnings: string[] = [];

    // Validar el rol
    if (rol === '') {
      newWarnings.push("Debe seleccionar un rol.");
    }

    // Validar horarios
    const horarioWarnings = validarHorarios();
    newWarnings.push(...horarioWarnings);

    // Mostrar advertencias si las hay
    if (newWarnings.length > 0) {
      setWarnings(newWarnings);
      return;
    }

    const vacante: vacante = {
      id_vacante: 0,
      id_user_fte: null,
      id_feria: idFeria,
      id_rol: parseInt(rol), // Convertir rol a número
      ingreso: todayISO,
      termino: todayISO,
      id_estado_vacante: 1,
      horarios: horarios
    };

    try {
      await saveVacanteFeria(vacante);
      setRol(''); // Resetear rol
      setHorarios([]); // Resetear horarios
      setWarnings([]); // Limpiar advertencias
    } catch (error) {
      console.error("Error al crear la vacante:", error);
      setWarnings(["Error al guardar la vacante. Intente nuevamente."]);
    }
  };

  const eliminarHorario = (id_dia: number) => {
    setHorarios(horarios.filter(h => h.id_dia !== id_dia));
  };

  return (
    <>
      <div className="crear-vacante">
        <h2 className="crear-vacante-title">CREAR NUEVA VACANTE</h2>
        <div className="crear-vacante-form">
          <div className="crear-vacante-role">
            <select 
              id="role" 
              className="crear-vacante-select" 
              value={rol} 
              onChange={(e) => setRol(e.target.value)} 
              required
            >
              <option value="" disabled>Seleccione un rol</option>
              <option value="1">Supervisor</option>
              <option value="2">Ayudante</option> 
            </select>
            <div className="crear-vacante-horario">
              <NewHorario saveHorario={saveHorario} /> {/* Pasar la función al hijo */}
            </div>
          </div>
          
          <div className="crear-vacante-horarios-list">
            {horarios.map((horario, index) => (
              <div className="crear-vacante-horario-item" key={index}>
                <strong className="crear-vacante-horario-label">
                  {semana[horario.id_dia]} de {horario.hora_entrada} a {horario.hora_salida}
                </strong>
                <button 
                  className="crear-vacante-horario-delete-btn" 
                  onClick={() => eliminarHorario(horario.id_dia)}
                >
                  Eliminar Horario
                </button>
              </div>
            ))}
          </div>
          
          {/* Mostrar advertencias */}
          {warnings.length > 0 && (
            <div className="crear-vacante-warnings" style={{ color: "red", marginTop: "10px" }}>
              {warnings.map((warning, index) => (
                <p key={index} className="crear-vacante-warning-item">{warning}</p>
              ))}
            </div>
          )}
          <button 
            className="crear-vacante-submit-btn" 
            onClick={guardarVacante}
          >
            Agregar Vacante
          </button>
        </div>
</div>

    </>
  );
};
