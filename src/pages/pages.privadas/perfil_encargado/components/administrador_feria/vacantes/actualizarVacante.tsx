import { useState } from "react";
import Modal from "react-modal";
import { vacante } from "../../../../../models/interfaces";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
  vacante: vacante;
  onSave: (updatedVacante: vacante, id_feria: number) => void; // Función para manejar los cambios
}

// Asegúrate de configurar el root del modal correctamente
Modal.setAppElement("#root");

export const VacanteModal = ({ isOpen, onClose, vacante, onSave }: modalProps) => {
  const semana = ['none', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

  // Estado local para manejar los cambios
  const [editedVacante, setEditedVacante] = useState<vacante>(vacante);

  // Maneja el cambio de los valores principales de la vacante
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedVacante({
      ...editedVacante,
      [name]: name === "id_estado_vacante" || name === "id_rol" ? Number(value) : value,
    });
  };

  // Maneja el cambio de los horarios dentro de la vacante
  const handleHorarioChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedHorarios = [...editedVacante.horarios];
    updatedHorarios[index] = { ...updatedHorarios[index], [name]: value }; // Actualiza el horario en el índice correspondiente
    setEditedVacante({ ...editedVacante, horarios: updatedHorarios });
  };

  // Guarda los cambios realizados y cierra el modal
  const handleSaveClick = () => {
    onSave(editedVacante, editedVacante.id_feria); // Llama a la función de guardado con la vacante editada
    onClose(); // Cierra el modal
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
          <option value={1}>supervisor</option>
          <option value={2}>ayudante</option>
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

      {/* Mapeo de horarios para permitir su edición */}
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
              onChange={(e) => handleHorarioChange(index, e)} // Actualiza cada horario individualmente
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
              onChange={(e) => handleHorarioChange(index, e)} // Actualiza cada horario individualmente
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
