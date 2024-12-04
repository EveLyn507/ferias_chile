import { useState } from "react";
import { horarioVacante, vacante } from "../../../../../../models/interfaces";
import { saveVacanteFeria } from "../../../../services/admin_feria_fuctions";
import { NewHorario } from "./newHorario";
import Modal from "react-modal";
import { useToast } from "@components/ToastService"; // Usando alias para importar ToastService

interface newVacanteModal {
  isOpen: boolean;
  id_feria: number;
  onClose: () => void;
}

Modal.setAppElement("#root");

export const CrearVacanteModal = ({ id_feria, isOpen, onClose }: newVacanteModal) => {
  const [rol, setRol] = useState("");
  const [horarios, setHorarios] = useState<horarioVacante[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  const semana = [
    "none",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  const todayISO = new Date().toISOString().split("T")[0];

  const saveHorario = (newHorario: horarioVacante) => {
    setHorarios([...horarios, newHorario]);
    addToast({ type: "success", message: "Horario añadido correctamente." });
  };

  const eliminarHorario = (id_dia: number) => {
    setHorarios(horarios.filter((horario) => horario.id_dia !== id_dia));
    addToast({ type: "info", message: "Horario eliminado." });
  };

  const guardarVacante = async () => {
    const newWarnings: string[] = [];

    if (!rol) {
      newWarnings.push("Debe seleccionar un rol.");
    }

    if (horarios.length === 0) {
      newWarnings.push("Debe agregar al menos un horario.");
    }

    if (newWarnings.length > 0) {
      setWarnings(newWarnings);
      addToast({ type: "error", message: "Corrija los errores antes de continuar." });
      return;
    }

    const nuevaVacante: vacante = {
      id_vacante: 0,
      id_user_fte: null,
      id_feria,
      id_rol: parseInt(rol),
      ingreso: todayISO,
      termino: todayISO,
      id_estado_vacante: 1,
      horarios,
    };

    try {
      await saveVacanteFeria(nuevaVacante);
      setWarnings([]);
      setHorarios([]);
      setRol("");
      addToast({ type: "success", message: "Vacante creada exitosamente." });
    } catch (error) {
      console.error("Error al crear la vacante:", error);
      addToast({ type: "error", message: "Ocurrió un error al crear la vacante." });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Crear Vacante"
      style={{
        content: {
          maxWidth: "600px",
          margin: "auto",
          padding: "20px",
          borderRadius: "10px",
          overflow: "auto",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <h2>CREAR NUEVA VACANTE</h2>
      <div>
        <select
          id="role"
          name="role"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
        >
          <option value="" disabled>
            Seleccione un rol
          </option>
          <option value="1">Supervisor</option>
          <option value="2">Ayudante</option>
        </select>

        <NewHorario saveHorario={saveHorario} />

        {horarios.map((horario, index) => (
          <div key={index} className="ferias">
            <strong>
              {semana[horario.id_dia]} de {horario.hora_entrada} a {horario.hora_salida}
            </strong>
            <button onClick={() => eliminarHorario(horario.id_dia)}>Eliminar Horario</button>
          </div>
        ))}

        {warnings.length > 0 && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {warnings.map((warning, index) => (
              <p key={index}>{warning}</p>
            ))}
          </div>
        )}

        <button onClick={guardarVacante}>Agregar Vacante</button>
      </div>

      <button
        onClick={onClose}
        style={{
          float: "right",
          padding: "5px 10px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Cerrar
      </button>
    </Modal>
  );
};
