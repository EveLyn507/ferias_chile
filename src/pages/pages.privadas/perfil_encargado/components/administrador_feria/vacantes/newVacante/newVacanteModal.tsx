import { useState } from "react";
import { horarioVacante, vacante } from "../../../../../../models/interfaces";
import { saveVacanteFeria } from "../../../../services/admin_feria_fuctions";
import { NewHorario } from "./newHorario";
import Modal from "react-modal";
import { useToast } from "../../../../../../../components/ToastService";

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
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        },
        overlay: {
          backgroundColor: "rgba(4, 44, 76, 0.8)",
        },
      }}
    >
      <h2 style={{ textAlign: "center", color: "#042c4c", marginBottom: "20px" }}>CREAR NUEVA VACANTE</h2>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <select
          id="role"
          name="role"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="" disabled>
            Seleccione un rol
          </option>
          <option value="1">Supervisor</option>
          <option value="2">Ayudante</option>
        </select>

        <NewHorario saveHorario={saveHorario} />

        {horarios.map((horario, index) => (
          <div 
            key={index} 
            style={{
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              backgroundColor: "#f9f9f9", 
              padding: "10px", 
              marginBottom: "10px", 
              borderRadius: "6px", 
              border: "1px solid #ddd"
            }}
          >
            <strong>
              {semana[horario.id_dia]} de {horario.hora_entrada} a {horario.hora_salida}
            </strong>
            <button 
              onClick={() => eliminarHorario(horario.id_dia)} 
              style={{
                padding: "8px 16px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Eliminar Horario
            </button>
          </div>
        ))}

        {warnings.length > 0 && (
          <div 
            style={{ 
              color: "red", 
              marginTop: "10px", 
              padding: "10px", 
              borderRadius: "4px", 
              backgroundColor: "#ffe6e6" 
            }}
          >
            {warnings.map((warning, index) => (
              <p key={index}>{warning}</p>
            ))}
          </div>
        )}

        <button 
          onClick={guardarVacante} 
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            backgroundColor: "#042c4c",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
            transition: "background-color 0.3s ease",
          }}
        >
          Agregar Vacante
        </button>
      </div>

      <button
        onClick={onClose}
        style={{
          float: "right",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Cerrar
      </button>
    </Modal>
  );
};
