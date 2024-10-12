import { Link } from "react-router-dom";

// Define la interfaz para los objetos de feria
interface Feria {
    id_feria: number;
    nombre_feria: string;
    comuna : string;
    region: string;
}

// Define las props del componente, en este caso un array de objetos Feria
interface ItemListProps {
    ferias: Feria[];
}
export const Item_list = ({ ferias }: ItemListProps) => {
    console.log(ferias);

    return (
        <>
            <div className="ferias">
                {ferias.map((feria) => (
                    <div className="card" key={feria.id_feria}>
                        <ul>
                            <li> feria :  {feria.nombre_feria} </li>
                            <li> Comuna  : {feria.comuna} </li>
                            <li> region : {feria.region} </li>
                            <li>< Link to={`/feria/${feria.id_feria}`}> Ver Puestos Feria </Link></li>                      
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
};

