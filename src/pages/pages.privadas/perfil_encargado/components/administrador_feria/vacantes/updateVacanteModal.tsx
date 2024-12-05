/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Modal from "react-modal";
import { vacante } from "../../../../../models/interfaces";
import { useToast } from "../../../../../../components/ToastService";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
  vacante: vacante;
  onSave: (updatedVacante: vacante, id_feria: number) => void;
}

Modal.setAppElement("#root");

export const VacanteModal = ({ isOpen, onClose, vacante, onSave }: modalProps) => {
  const semana = ['none', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const [editedVacante, setEditedVacante] = useState<vacante>(vacante); 
  const [errorMessage, _setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { addToast } = useToast(); // Usa el servicio de toast

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedVacante({
      ...editedVacante,
      [name]: name === "id_estado_vacante" || name === "id_rol" ? Number(value) : value,
    });
  };

  const handleHorarioChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedHorarios = [...editedVacante.horarios];
    updatedHorarios[index] = { ...updatedHorarios[index], [name]: value };
    setEditedVacante({ ...editedVacante, horarios: updatedHorarios });
  };

  const validateVacante = () => {
    if (!editedVacante.ingreso || !editedVacante.termino) {
      addToast({ type: 'error', message: 'Las fechas de ingreso y término son obligatorias.' });
      return false;
    }

    if (editedVacante.ingreso >= editedVacante.termino) {
      addToast({ type: 'error', message: 'La fecha de ingreso debe ser anterior a la de término.' });
      return false;
    }

    for (const horario of editedVacante.horarios) {
      if (!horario.hora_entrada || !horario.hora_salida) {
        addToast({ type: 'error', message: 'Todos los horarios deben incluir una hora de entrada y salida.' });
        return false;
      }

      if (horario.hora_entrada >= horario.hora_salida) {
        addToast({ type: 'error', message: `La hora de entrada debe ser anterior a la hora de salida (${semana[horario.id_dia]}).` });
        return false;
      }
    }

    return true;
  };

  const handleSaveClick = () => {
    if (validateVacante()) {
      onSave(editedVacante, editedVacante.id_feria);
      addToast({ type: 'success', message: 'Los cambios se han guardado correctamente.' });
      setSuccessMessage("Los cambios se han guardado correctamente.");
      setTimeout(() => setSuccessMessage(null), 3000); // Limpia el mensaje después de 3 segundos
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          borderRadius: "10px",
          width: "600px",
          maxHeight: "80vh",
          overflow: "auto",
        },
      }}
    >
      <h2>Editar Detalles del Puesto</h2>

      {errorMessage && <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green", marginBottom: "10px" }}>{successMessage}</p>}

      <label>
        <strong>ID:</strong> {editedVacante.id_vacante}
      </label>
      <br />

      <label>
        <strong>Rol:</strong>
        <select
          name="id_rol"
          value={editedVacante.id_rol}
          onChange={handleInputChange}
          style={{ margin: "5px 0", padding: "5px", width: "100%" }}
        >
          <option value={1}>Supervisor</option>
          <option value={2}>Ayudante</option>
        </select>
      </label>
      <br />

      <label>
        <strong>Ingreso:</strong>
        <input
          type="text"
          name="ingreso"
          value={editedVacante.ingreso}
          onChange={handleInputChange}
          style={{ margin: "5px 0", padding: "5px", width: "100%" }}
        />
      </label>
      <br />

      <label>
        <strong>Término:</strong>
        <input
          type="text"
          name="termino"
          value={editedVacante.termino}
          onChange={handleInputChange}
          style={{ margin: "5px 0", padding: "5px", width: "100%" }}
        />
      </label>
      <br />

      <h3>Horarios:</h3>
      {editedVacante.horarios.map((horario, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <span> {semana[horario.id_dia]}</span>
          <br />
          <label>
            <strong>Hora entrada </strong>
            <input
              type="time"
              name="hora_entrada"
              value={horario.hora_entrada}
              onChange={(e) => handleHorarioChange(index, e)}
              style={{ margin: "5px 0", padding: "5px", width: "100%" }}
            />
          </label>
          <br />
          <label>
            <strong>Hora salida</strong>
            <input
              type="time"
              name="hora_salida"
              value={horario.hora_salida}
              onChange={(e) => handleHorarioChange(index, e)}
              style={{ margin: "5px 0", padding: "5px", width: "100%" }}
            />
          </label>
          <br />
        </div>
      ))}

      <div style={{ marginTop: "15px", textAlign: "right" }}>
        <button
          onClick={handleSaveClick}
          style={{
            marginRight: "10px",
            padding: "10px",
            backgroundColor: "#28A745",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Guardar
        </button>

        <button
          onClick={onClose}
          style={{
            marginRight: "10px",
            padding: "10px",
            backgroundColor: "#DC3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};
