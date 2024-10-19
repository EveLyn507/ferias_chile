import { Link } from "react-router-dom";
import { FeriasProps } from "../../../../models/interfaces";
import { Card } from "../../../../components/card";
import DiasActivos from "./programa_feria";


// Define las props del componente, en este caso un array de objetos Feria
export const CardFerias = ({ ferias }: FeriasProps) => {
    return (
        <Card
            items={ferias}
            renderFields={(feria) => [
                { label: "Nombre", value: feria.nombre_feria },
                { label: "Región", value: feria.region },
                { label: "Comuna", value: feria.comuna },
                { 
                    label: "Días Activos", 
                    value: <DiasActivos programa={feria.programa[0]} /> // Asumiendo que programa es un array
                }
            ]}
            actions={(feria) => (
                <li>
                    <Link to={`/feria/${feria.id_feria}`}>Ver Puestos Feria</Link>
                </li>
            )}
        />
    );
};
