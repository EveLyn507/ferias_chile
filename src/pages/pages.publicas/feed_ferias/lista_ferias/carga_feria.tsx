import { useEffect, useState } from 'react';
import { Item_list } from './list_ferias';
import axios from 'axios';
import { Feria } from '../../../interfaces';

// Define la interfaz para los objetos de feria



const traerFerias = async () => {

try{
    const response  = await axios.get('http://localhost:5000/Feed-ferias')
    const feria = response.data
    return feria

}
catch (error) {
    console.error('Error al traer ferias', error);

  }
}


const Feed_d_ferias = () => {
    // Tipar el estado como un array de objetos "Feria"
    const [ferias, setFerias] = useState<Feria[]>([]);

    useEffect((() => { 
        traerFerias().then( (res: Feria[]) => {setFerias(res);}).
        catch((error ) => { console.error("Error al cargar ferias:", error)})
      
    }) ,[]);

   
    return (
    <Item_list ferias={ferias} />

    )
    
};

export default Feed_d_ferias;
