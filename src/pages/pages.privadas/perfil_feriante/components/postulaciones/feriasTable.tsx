import { useState } from "react";
import { feriasTableProps, vacantePostular} from "./interfaces";
import { getVacantesFeria } from "../../services/postulacionesFunction";
import { FteModalPostulaciones } from "./postulacionesModal";





export const FeriasTable = ({ ferias }: feriasTableProps) => {
    console.log(ferias);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vacantes , setVacantes] = useState<vacantePostular[]>([])
    
    const fetchDataModal = async(id_feria : number) => {
        const vacantesFeria  =  await getVacantesFeria(id_feria)
        setVacantes(vacantesFeria)
      }

      const openVacanteModal = async( id_feria : number) => {
    
        setIsModalOpen(true)
        await fetchDataModal(id_feria)
        
      } 

  
    return (
        <>
         <FteModalPostulaciones
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vacantes={vacantes}
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
                                <td><button onClick={() => openVacanteModal(feria.id_feria)}>Ver Vacantes ({feria.conteo_vacantes})</button></td>
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
