import { useState } from "react"
import { horarioVacante, vacante } from "../../../../../models/interfaces";
import { saveVacanteFeria } from "../../../services/admin_feria_fuctions";
import { useParams } from "react-router-dom";
import { NewHorario } from "./newHorario";

export const CrearVacante = () => {
  // Variables de url o redux
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria, 10) : 0; // Se pasa hacia aca para que no quede como undefined o null

  // Variables internas que completan el objeto que se enviara al backend
  const [rol, setRol] = useState('');
  const semana = ['none', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const [horarios, setHorarios] = useState<horarioVacante[]>([]); // Esta es la lista de horarios de la nueva vacante

  const [warnings, setWarnings] = useState<string[]>([]); // Estado para los mensajes de advertencia

  // Funciones componente hijo -> NewHorario
  const saveHorario = async (newHorario: horarioVacante) => {
    setHorarios([...horarios, newHorario]);
  }

  const todayISO = new Date().toISOString().split('T')[0];

  // INICIO FUNCION guardarVacante -- guarda en backend y en rxjs vacante
  const guardarVacante = async () => {
    const newWarnings: string[] = [];

    // Validar si hay al menos un horario y si se ha seleccionado un rol
    if (horarios.length === 0) {
      newWarnings.push("Debe agregar al menos un horario.");
    }
    if (rol === '') {
      newWarnings.push("Debe seleccionar un rol.");
    }

    if (newWarnings.length > 0) {
      setWarnings(newWarnings); // Actualizar advertencias
      return; // No continuar si hay advertencias
    }

    // Esto es el objeto que se enviara al backend
    const vacante: vacante = {
      id_vacante: 0,
      id_user_fte: null,
      id_feria: idFeria,
      id_rol: parseInt(rol), // Asegurarse de que el rol sea un número
      ingreso: todayISO,
      termino: todayISO,
      id_estado_vacante: 1,
      horarios: horarios
    };

    try {
      // Guardar en backend y en rxjs
      await saveVacanteFeria(vacante);

      // Resetea los estados si es necesario
      setRol('');
      setHorarios([]);
      setWarnings([]); // Limpiar advertencias al guardar exitosamente
    } catch (error) {
      console.error("Error al crear la vacante:", error);
    }
  }
  // FIN FUNCION guardarVacante

  // ELIMINA EL HORARIO
  const eliminarHorario = async (id_dia: number) => {
    const currentHorarios = horarios;
    const updatedHorarios = currentHorarios.filter(b => b.id_dia !== id_dia);
    setHorarios(updatedHorarios);
  }

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
              required>
              <option value="" disabled>Select a role</option>
              <option value="1">Supervisor</option>
              <option value="2">Ayudante</option> 
          </select>
          <div><NewHorario saveHorario={saveHorario} /> {/* Pasas la función al hijo */}</div>
        </div>
        
        <div>
          {horarios.map((horario, index) => (
            <div className="ferias" key={index}>
              <strong>{semana[horario.id_dia]} de {horario.hora_entrada} a {horario.hora_salida}</strong>
              <button onClick={() => eliminarHorario(horario.id_dia)}> eliminar Horario</button>
            </div>
          ))}
        </div>
        
        {/* Mostrar mensajes de advertencia si los hay */}
        {warnings.length > 0 && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {warnings.map((warning, index) => (
              <p key={index}>{warning}</p>
            ))}
          </div>
        )}
        {/* Botón "Agregar vacante" */}
        <button onClick={guardarVacante}>agregar vacante</button>
      </div>
    </>
  )
}
