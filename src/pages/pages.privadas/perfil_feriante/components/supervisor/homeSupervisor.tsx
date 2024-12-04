import { useParams } from "react-router-dom";
import GestionSupervisor from "./GestionSupervisor";
import './Supervisor.css';



export const HomeSupervisor = () => {
  const { id_feria } = useParams<{ id_feria: string }>(); 
  const idFeria = id_feria ? parseInt(id_feria) : null
  const { nombre_feria } = useParams<{ nombre_feria: string }>(); 


    return (
  <GestionSupervisor id_feria={idFeria!} nombre_feria={nombre_feria!}/>
)
};

export default HomeSupervisor;
