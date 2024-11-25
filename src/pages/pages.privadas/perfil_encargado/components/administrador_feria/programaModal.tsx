import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ProgramaFeria } from '../../../../models/interfaces';
import './prograModal.css'



interface EditProgramaModalProps {
  isOpen: boolean;
  onClose: () => void;
  programa: ProgramaFeria;
  onSave: (updatedPrograma: ProgramaFeria) => void;
}

Modal.setAppElement("#root");

const EditProgramaModal: React.FC<EditProgramaModalProps> = ({
  isOpen,
  onClose,
  programa,
  onSave,
}) => {
  const [editedPrograma, setEditedPrograma] = useState<ProgramaFeria>(programa);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setWarnings([]);
    setSuccessMessage(null);
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPrograma((prev) => ({
      ...prev,
      [name]: name === 'id_dia_armado' || name === 'id_dia' ? parseInt(value, 10) : value,
    }));
  };


  const handleChangebox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
  
    setEditedPrograma((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };
  


  const validateFields = (): boolean => {
    const errors: string[] = [];
    if (!editedPrograma.hora_inicio) {
      errors.push("La hora de inicio es obligatoria.");
    }
    if (!editedPrograma.hora_termino) {
      errors.push("La hora de término es obligatoria.");
    }
    if (editedPrograma.hora_inicio && editedPrograma.hora_termino && editedPrograma.hora_inicio >= editedPrograma.hora_termino) {
      errors.push("La hora de inicio debe ser anterior a la hora de término.");
    }
    if (!editedPrograma.hora_inicio_armado) {
      errors.push("La hora de inicio del armado es obligatoria.");
    }
    if (!editedPrograma.hora_termino_armado) {
      errors.push("La hora de término del armado es obligatoria.");
    }
    if (editedPrograma.hora_inicio_armado && editedPrograma.hora_termino_armado && editedPrograma.hora_inicio_armado >= editedPrograma.hora_termino_armado) {
      errors.push("La hora de inicio del armado debe ser anterior a la hora de término.");
    }
    setWarnings(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validateFields()) {
      onSave(editedPrograma);
      setSuccessMessage("Programa actualizado correctamente.");
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Editar Programa"
      ariaHideApp={false}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Editar Programa</h2>

      {warnings.length > 0 && (
        <div className="modal-warnings" style={{ color: "red", marginBottom: "10px" }}>
          {warnings.map((warning, index) => (
            <p key={index}>{warning}</p>
          ))}
        </div>
      )}

      {successMessage && (
        <div className="modal-success" style={{ color: "green", marginBottom: "10px" }}>
          <p>{successMessage}</p>
        </div>
      )}

      <label>Hora Inicio</label>
      <input
        type="time"
        name="hora_inicio"
        value={editedPrograma.hora_inicio}
        onChange={handleChange}
      />
      <label>Hora Término</label>
      <input
        type="time"
        name="hora_termino"
        value={editedPrograma.hora_termino}
        onChange={handleChange}
      />
      <label>Día Armado</label>
      <input
        type="number"
        name="id_dia_armado"
        value={editedPrograma.id_dia_armado}
        onChange={handleChange}
      />
      <label>Hora Inicio Armado</label>
      <input
        type="time"
        name="hora_inicio_armado"
        value={editedPrograma.hora_inicio_armado}
        onChange={handleChange}
      />
      <label>Hora Término Armado</label>
      <input
        type="time"
        name="hora_termino_armado"
        value={editedPrograma.hora_termino_armado}
        onChange={handleChange}
      />
        <label>horario activo</label>
          <input
        type="checkbox" 
        name="activo"
        checked={editedPrograma.activo}
        onChange={handleChangebox}
      />
      <div className="modal-actions">
        <button onClick={onClose}>Cancelar</button>
        <button onClick={handleSave}>Guardar</button>
      </div>
    </Modal>
  );
};

export default EditProgramaModal;
