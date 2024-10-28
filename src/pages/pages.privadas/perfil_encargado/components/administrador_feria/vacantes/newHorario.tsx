import { useState } from "react"
import { horarioVacante } from "../../../../../models/interfaces"


interface newVacanteProps {
    saveHorario : (horario : horarioVacante) => void
}



export const NewHorario = ({saveHorario } : newVacanteProps) => {
  // esto sirve para añadir un horario a la lista de horarios de la nueva vacante
  const [addHorario, setaddHorario] = useState<horarioVacante>({
    id_detalle_horario :  null,
    id_vacante : null,
    id_dia: 0,
    hora_inicio: '',
    hora_termino: ''
  }) 

console.log(addHorario);

  return (
    <>
    <input type="time" placeholder="hora inicio "  onChange={(e) => setaddHorario({...addHorario , hora_inicio : e.target.value})}/>
    <input type="time" placeholder="hora termino "onChange={(e) => setaddHorario({...addHorario , hora_termino : e.target.value})} />
    <input type="number" placeholder="numero dia" onChange={(e) => setaddHorario({ ...addHorario, id_dia: parseInt(e.target.value, 10) })} />
    <button onClick={() => saveHorario(addHorario)}> añadir horario</button>
    </>
  )
}