import { useState } from "react";
import { horarioVacante } from "../../../../../models/interfaces";

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
    const [warnings, setWarnings] = useState<string[]>([]);

    const clear = () => {
        setAddHorario(defaultHorario);
        setWarnings([]); // Limpiar advertencias al reiniciar
    };

    const handleAddHorario = () => {
        const newWarnings: string[] = [];

        // Validaciones de los campos
        if (!addHorario.hora_entrada) {
            newWarnings.push("La hora de inicio es requerida.");
        }
        if (!addHorario.hora_salida) {
            newWarnings.push("La hora de término es requerida.");
        }
        if (addHorario.hora_entrada && addHorario.hora_salida && addHorario.hora_entrada >= addHorario.hora_salida) {
            newWarnings.push("La hora de inicio debe ser anterior a la hora de término.");
        }
        if (addHorario.id_dia <= 0) {
            newWarnings.push("Debe seleccionar un día.");
        }

        if (newWarnings.length > 0) {
            setWarnings(newWarnings); // Mostrar advertencias si las hay
        } else {
            saveHorario(addHorario); // Guardar horario si no hay errores
            clear();
        }
    };

    return (
        <>
            <div className="new-horario">
                <input 
                    type="time" 
                    className="new-horario-input"
                    placeholder="Hora inicio" 
                    value={addHorario.hora_entrada}  
                    onChange={(e) => setAddHorario({ ...addHorario, hora_entrada: e.target.value })} 
                    required 
                />
                <input 
                    type="time" 
                    className="new-horario-input"
                    placeholder="Hora término"  
                    value={addHorario.hora_salida} 
                    onChange={(e) => setAddHorario({ ...addHorario, hora_salida: e.target.value })} 
                    required 
                />
                <select 
                    className="new-horario-select"
                    id="id_dia" 
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
                <button className="new-horario-btn" onClick={handleAddHorario}>
                    Añadir horario
                </button>
                
                {warnings.length > 0 && (
                    <div className="new-horario-error" style={{ color: "red", marginTop: "10px" }}>
                    {warnings.map((warning, index) => (
                        <p key={index} className="new-horario-error-item">{warning}</p>
                    ))}
                    </div>
                )}
                </div>

        </>
    );
};
