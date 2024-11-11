/* eslint-disable react-hooks/exhaustive-deps */
import {  useEffect, useState } from 'react';
import { Feria } from '../../../../models/interfaces';
import { traerFerias } from '../../services/traer_ferias';
import Paginacion from './paginacion';
import { CardFerias } from './card_feria';

// Define la interfaz para los objetos de feria
interface feedProps {
  comuna : number| null 
  region : number| null
}


const Feed_d_ferias = ({comuna , region } : feedProps) => {
  const [ferias, setFerias] = useState<Feria[]>([]);
  const [page , setPage] = useState(1)
  const limit = 10


const carga =  async (page : number , limit : number ) => {
    // Llamada a la función traerFerias con paginado

  await traerFerias(page, limit , comuna, region ).then((res: Feria[]) => {
  setFerias(res);
  })
  .catch((error) => {
  console.error("Error al cargar ferias:", error);
  });

}
console.log('hola');


useEffect(() => {
  carga(page, limit)
}, [page , comuna , region])

    return (
        <>
   <div>
   <br />
   <Paginacion  page={page} setPage={setPage}/>
   <CardFerias ferias={ferias} />
   <Paginacion  page={page} setPage={setPage}/>
   </div>
        </>
    )
  }

export default Feed_d_ferias;




