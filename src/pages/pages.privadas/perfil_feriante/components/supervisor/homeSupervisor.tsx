// HomeSupervisor.tsx
import { useParams } from "react-router-dom";
import GestionSupervisor from "./GestionSupervisor";

export const HomeSupervisor = () => {
  const { id_feria } = useParams<{ id_feria: string }>(); 
  return id_feria ? <GestionSupervisor id_feria={parseInt(id_feria, 10)} /> : null; 
};

export default HomeSupervisor;
