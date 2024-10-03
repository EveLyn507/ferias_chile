import { useEffect, useState } from 'react';
import { pedirDatos } from '../../helper/PedirDatos';
import { Item_list } from './list_ferias';

const Feed_d_ferias = () => {
    const [ferias, setFerias] = useState([]);
    

    useEffect(() => {
        pedirDatos()
            .then((res) => {
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
