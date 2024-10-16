import { Link } from "react-router-dom";
import {  FeriasProps } from "../../../../models/interfaces";
import { Card } from "../../../../components/card";

// Define la interfaz para los objetos de feria

// Define las props del componente, en este caso un array de objetos Feria



export const CardFerias = ({ ferias }: FeriasProps) => {
    return (
      <Card
        items={ferias}
        renderFields={(feria) => [
          { label: "Nombre", value: feria.nombre_feria },
          { label: "region", value: feria.region },
          { label: "comuna", value: feria.comuna },
        ]}
        actions={(feria) => (
          <>
             <li>
             < Link to={`/feria/${feria.id_feria}`}> Ver Puestos Feria </Link>   </li>
          </>
        )}
      />
    );
  };
  
