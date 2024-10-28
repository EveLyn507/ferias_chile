import { useState } from "react"
import { horarioVacante } from "../../../../../models/interfaces"

interface newVacanteProps {
    saveHorario: (horario: horarioVacante) => void
}

const defaultHorario: horarioVacante = {
    id_detalle_horario: null,
    id_vacante: null,
    id_dia: 0,
    hora_inicio: '',
    hora_termino: ''
}

export const NewHorario = ({ saveHorario }: newVacanteProps) => {
    const [addHorario, setAddHorario] = useState<horarioVacante>(defaultHorario)
    const [warnings, setWarnings] = useState<string[]>([])

    const clear = () => {
        setAddHorario(defaultHorario)
        setWarnings([]) // Limpiar advertencias al reiniciar
    }

    const handleAddHorario = () => {
        const newWarnings: string[] = []

        // Validar que los campos requeridos no estén vacíos
        if (!addHorario.hora_inicio) {
            newWarnings.push("La hora de inicio es requerida.");
        }
        if (!addHorario.hora_termino) {
            newWarnings.push("La hora de término es requerida.");
        }
        if (addHorario.id_dia <= 0) {
            newWarnings.push("Debe seleccionar un día.");
        }

        if (newWarnings.length > 0) {
            setWarnings(newWarnings); // Actualizar advertencias
        } else {
            saveHorario(addHorario);
            clear();
        }
    }

    return (
        <>
            <input 
                type="time" 
                placeholder="hora inicio" 
                value={addHorario.hora_inicio}  
                onChange={(e) => setAddHorario({ ...addHorario, hora_inicio: e.target.value })} 
                required 
            />
            <input 
                type="time" 
                placeholder="hora termino"  
                value={addHorario.hora_termino} 
                onChange={(e) => setAddHorario({ ...addHorario, hora_termino: e.target.value })} 
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
                <option value="3">Miercoles</option>
                <option value="4">Jueves</option> 
                <option value="5">Viernes</option>
                <option value="6">Sabado</option> 
                <option value="7">Domingo</option>
            </select>
            <button onClick={handleAddHorario}>Añadir horario</button>
            
            {warnings.length > 0 && (
                <div style={{ color: "red", marginTop: "10px" }}>
                    {warnings.map((warning, index) => (
                        <p key={index}>{warning}</p>
                    ))}
                </div>
            )}
        </>
    )
}
