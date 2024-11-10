import { useEffect, useState } from 'react';
import { Feria } from '../../../../models/interfaces';
import { traerFerias } from '../../services/traer_ferias';
import Paginacion from './paginacion';

// Define la interfaz para los objetos de feria

const Feed_d_ferias = ({ selectedComuna }: { selectedComuna: string }) => {
  const [ferias, setFerias] = useState<Feria[]>([]);
  const [filteredFerias, setFilteredFerias] = useState<Feria[]>([]);



const carga =  async (page : number , limit : number) => {
    // Llamada a la función traerFerias con paginado

  await traerFerias(page, limit).then((res: Feria[]) => {
  setFerias(res);
  })
  .catch((error) => {
  console.error("Error al cargar ferias:", error);
  });

}



  useEffect(() => {
    if (selectedComuna) {
      setFilteredFerias(ferias.filter((feria) => feria.comuna === selectedComuna));
    } else {
      setFilteredFerias(ferias);
    }
  }, [selectedComuna, ferias]);
   

    return (
        <>
   <div>
   <br />
   <Paginacion carga={carga} ferias={filteredFerias} />
   </div>
        </>
    )
  }

export default Feed_d_ferias;




