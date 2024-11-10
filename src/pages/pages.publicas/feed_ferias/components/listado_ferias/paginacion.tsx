/* eslint-disable react-hooks/exhaustive-deps */
import {   useEffect, useState } from 'react';
import { CardFerias } from './card_feria';
import { Feria } from '../../../../models/interfaces';
import { traerFerias } from '../../services/traer_ferias';




const Paginacion = () => {
    // Estado para las ferias y la página actual
    const [ferias, setFerias] = useState<Feria[]>([]);
    const limit = 5
    const [page, setPage] = useState(1);   // Página actual
console.log(ferias);


        const carga =  async () => {
               // Llamada a la función traerFerias con paginado
        await traerFerias(page, limit).then((res: Feria[]) => {
            setFerias(res);
        })
        .catch((error) => {
            console.error("Error al cargar ferias:", error);
        });

        }
        useEffect(() =>  {
            carga()
        },[page])

    // Función para manejar el cambio de página
    const nextPage = async () => {
        await setPage((prevPage) => prevPage + 1); // Incrementa la página
 
    };

    const prevPage = async () => {
        await setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1)); // Decrementa la página, no permite valores menores a 1
   
    };

    return (
        <div>
            <CardFerias ferias={ferias} />
            
            <div>
                <button onClick={prevPage} disabled={page === 1}>
                    Anterior
                </button>
                <span>Página {page}</span>
                <button onClick={() =>  nextPage()}>
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default Paginacion;
