import React, { useState } from 'react';
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
  


  const handleSave = () => {
    onSave(editedPrograma);
    onClose();
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
