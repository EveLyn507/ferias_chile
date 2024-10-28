import { useState } from "react"
import { horarioVacante, vacante } from "../../../../../models/interfaces";
import { saveVacanteFeria } from "../../../services/admin_feria_fuctions";
import { useParams } from "react-router-dom";
import { NewHorario } from "./newHorario";

export const CrearVacante = () => {
  //variables de url o redux
  const {id_feria} = useParams<{id_feria :string }>();
  const idFeria =  id_feria ? parseInt(id_feria, 10)  : 0; // se pasa hacia aca para que no quede como undefined o null


  // variables internas que completan el objeto que se enviara al bakend

  const [rol, setRol] = useState('');


  const [horarios , setHorarios] = useState<horarioVacante[]>([]) //esta es la lista de horarios de la nueva vacante


  // FUNCIONES COMPONENTE HIJO -> NEWHORARIO
  const saveHorario = async (newHorario : horarioVacante) => {
    setHorarios([...horarios, newHorario]);
  }
  console.log(horarios);
  
  const todayISO = new Date().toISOString().split('T')[0];
   //INICIO FUNCION guardarVacante -- guarda en bakend y en rxjs vacante
    const guardarVacante = async () => {
      //esto es el objeto que se enviara al bakend
      const vacante: vacante = {
        id_vacante: 0,
        feriante_mail: null,
        supervisa_id_feria: idFeria,
        id_rol: 1,
        ingreso: todayISO,
        termino: todayISO,
        estado_vacante: 1,
        horarios : horarios
      };


      try {
        // guardar en bakend y en rxjs
        await saveVacanteFeria(vacante);
      
      
        // Resetea los estados si es necesario
        setRol('');
      } catch (error) {
        console.error("Error al crear la vacante:", error);
      }

    }
    //FIN FUNCION guardarVacante
//ELIMNA EL HORARIO
  const eliminarHorario = async (id_dia : number) => {
 
      const currentHorarios = horarios
      const updatedHorarios = currentHorarios.filter(b => b.id_dia !== id_dia);
      setHorarios(updatedHorarios)
  }
    

  return (
    <>
    <h2>CREAR NUEVA VACANTE</h2>
    <div>
      
      <div>
        <select 
            id="role" 
            name="role"  
            value={rol} 
            onChange={(e) => setRol(e.target.value)} 
            required>
            <option value="" disabled>Select a role</option>
            <option value={1}>Supervisor</option>
            <option value={2}>Ayudante</option> 

              </select>
          <div> <NewHorario saveHorario={saveHorario} /> {/* Pasas la función al hijo */}</div>

        </div>
      
        <div>
        {horarios.map((horario , index) => (
        
          <div className="ferias" key={index}>
          <strong > {horario.id_dia}  de {horario.hora_inicio} a {horario.hora_termino}</strong>

          <button onClick={() => eliminarHorario(horario.id_dia)}> eliminar Horario</button>
          </div>
    
          
        ))  
        }
        </div>
       
      
      <button onClick={guardarVacante}> agregar vacante</button>
    </div>


 
    </>
  )
}