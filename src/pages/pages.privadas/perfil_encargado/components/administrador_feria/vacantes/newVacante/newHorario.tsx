import { useState } from "react";
import { horarioVacante } from "../../../../../../models/interfaces";
import { useToast } from "../../../../../../../components/ToastService";

interface newVacanteProps {
  saveHorario: (horario: horarioVacante) => void;
}

const defaultHorario: horarioVacante = {
  id_detalle_horario: null,
  id_vacante: null,
  id_dia: 0,
  hora_entrada: '',
  hora_salida: ''
};

export const NewHorario = ({ saveHorario }: newVacanteProps) => {
  const [addHorario, setAddHorario] = useState<horarioVacante>(defaultHorario);
  const { addToast } = useToast();

  const clear = () => {
    setAddHorario(defaultHorario);
  };

  const handleAddHorario = () => {
    if (!addHorario.hora_entrada || !addHorario.hora_salida) {
      addToast({ type: 'warning', message: 'Las horas de inicio y término son requeridas.' });
      return;
    }
    if (addHorario.hora_entrada >= addHorario.hora_salida) {
      addToast({ type: 'error', message: 'La hora de inicio debe ser anterior a la hora de término.' });
      return;
    }
    if (addHorario.id_dia <= 0) {
      addToast({ type: 'error', message: 'Debe seleccionar un día válido.' });
      return;
    }

    saveHorario(addHorario);
    addToast({ type: 'success', message: 'Horario añadido correctamente.' });
    clear();
  };

  return (
    <>
      <div className="new-horario">
        <input
          type="time"
          placeholder="Hora inicio"
          value={addHorario.hora_entrada}
          onChange={(e) => setAddHorario({ ...addHorario, hora_entrada: e.target.value })}
          required
        />
        <input
          type="time"
          placeholder="Hora término"
          value={addHorario.hora_salida}
          onChange={(e) => setAddHorario({ ...addHorario, hora_salida: e.target.value })}
          required
        />
        <select
          id="id_dia"
          name="id_dia"
          value={addHorario.id_dia}
          onChange={(e) => setAddHorario({ ...addHorario, id_dia: parseInt(e.target.value) })}
          required
        >
          <option value="0" disabled>Seleccione el día</option>
          <option value="1">Lunes</option>
          <option value="2">Martes</option>
          <option value="3">Miércoles</option>
          <option value="4">Jueves</option>
          <option value="5">Viernes</option>
          <option value="6">Sábado</option>
          <option value="7">Domingo</option>
        </select>
        <button onClick={handleAddHorario}>Añadir horario</button>

        

        
      </div>
    </>
  );
};
