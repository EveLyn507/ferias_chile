import {  useNavigate } from "react-router-dom";
import { acPuestoProps, ActividadPuesto,} from "../../../../models/interfaces";
import { Card } from "../../../../components/card";



export const Card_puestos = ({ puestos }: acPuestoProps) => {
   console.log(puestos)
    const navigate = useNavigate();
    const handleContratarClick = (puesto: ActividadPuesto) => {
        // Navega a /pagosss y pasa el puesto seleccionado en el estado
        navigate("/pagosss", { state: { puesto } });
      };

      return (
        <Card
          items={puestos}
          renderFields={(puesto) => [
            { label: "numero puesto", value: puesto.numero },
            { label: "numero horario", value: puesto.num_horario },
            { label: "hora inicio", value: puesto.hora_inicio },
            { label: "hora termino", value: puesto.hora_termino },
            { label: "precio", value: puesto.precio },
            { label: "disponible", value: puesto.disponible },
          ]}
          actions={(puesto) => (
            <>
                <button onClick={() => handleContratarClick(puesto)}>   Contratar </button> 
            </>
          )}
        />
      );
};





