import { useEffect, useState } from 'react';
import { pedirDatos } from '../../helper/PedirDatos';
import { Item_list } from './list_ferias';

// Define la interfaz para los objetos de feria
interface Feria {
    id: number;
    nombre: string;
}

const Feed_d_ferias = () => {
    // Tipar el estado como un array de objetos "Feria"
    const [ferias, setFerias] = useState<Feria[]>([]);

    useEffect(() => {
        pedirDatos()
            .then((res: Feria[]) => {
                setFerias(res);
            })
            .catch((error) => {
                console.error("Error al cargar ferias:", error);
            });
    }, []);

    return (
    <Item_list ferias={ferias} />

    )
    
};

export default Feed_d_ferias;
