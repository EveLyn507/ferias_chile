import { useEffect, useState } from 'react';
import { CardFerias } from './card_feria';

import { Feria } from '../../../../models/interfaces';
import { traerFerias } from '../../services/traer_ferias';

// Define la interfaz para los objetos de feria




const Feed_d_ferias = () => {
    // Tipar el estado como un array de objetos "Feria"
    const [ferias, setFerias] = useState<Feria[]>([]);

    useEffect((() => { 
        traerFerias().then( (res: Feria[]) => {setFerias(res);}).
        catch((error ) => { console.error("Error al cargar ferias:", error)})
      
    }) ,[]);

   
    return (
    <CardFerias ferias={ferias} />

    )
    
};

export default Feed_d_ferias;
