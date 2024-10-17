import {  useNavigate } from "react-router-dom";
import { puesto, PuestosProp } from "../../../../models/interfaces";
import { Card } from "../../../../components/card";



export const Card_puestos = ({ puestos }: PuestosProp) => {
   console.log(puestos)
    const navigate = useNavigate();
    const handleContratarClick = (puesto: puesto) => {
        // Navega a /pagosss y pasa el puesto seleccionado en el estado
        navigate("/pagosss", { state: { puesto } });
      };

      return (
        <Card
          items={puestos}
          renderFields={(puesto) => [
            { label: "numero puesto", value: puesto.num_puesto },
            { label: "numero horario", value: puesto.num_horario },
            { label: "hora inicio", value: puesto.hora_inicio },
            { label: "hora termino", value: puesto.hora_termino },
            { label: "precio", value: puesto.precio },
          ]}
          actions={(puesto) => (
            <>
                <button onClick={() => handleContratarClick(puesto)}>   Contratar </button> 
            </>
          )}
        />
      );
};





