import { useState } from "react";
import { feriasTableProps, vacantePostular} from "../interfaces";
import { getVacantesFeria } from "../../../services/postulacionesFunction";
import { FteModalPostulaciones } from "./postulacionesModal";


export const FeriasTable = ({ ferias }: feriasTableProps) => {
    console.log(ferias);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vacantes , setVacantes] = useState<vacantePostular[]>([])
    const [nombre_f , setNombreF] = useState<string | null>(null)
    const fetchDataModal = async(id_feria : number) => {
        const vacantesFeria  =  await getVacantesFeria(id_feria)
        setVacantes(vacantesFeria)
      }

      const openVacanteModal = async( id_feria : number , nombre : string) => {
    
        setIsModalOpen(true)
        await fetchDataModal(id_feria)
        setNombreF(nombre)
        
        
      } 

  
    return (
        <>
         <FteModalPostulaciones
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vacantes={vacantes}
          nombre_f={nombre_f}
        />


            {ferias ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre feria</th>
                            <th>Comuna</th>
                            <th>Región</th>
                            <th>Vacantes disponibles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ferias.map(feria => (
                            <tr key={feria.id_feria}>
                                <td>{feria.nombre}</td>
                                <td>{feria.comuna}</td>
                                <td>{feria.region}</td>
                                <td><button onClick={() => openVacanteModal(feria.id_feria , feria.nombre)}>Ver Vacantes ({feria.conteo_vacantes})</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <label>No hay ferias</label>
            )}
        </>
    );
};
