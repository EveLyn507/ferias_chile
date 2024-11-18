import {  useNavigate } from "react-router-dom";
import { Card } from "../../../../components/card";
import {  arriendo, arriendosListProp } from "./mapa/mapaModel";



export const Card_arriendos = ({ arriendos }: arriendosListProp) => {
const estado = ['none','disponible', 'en proceso venta' , 'arrendado']
    const navigate = useNavigate();
    const handleContratarClick = (arriendo: arriendo) => {
        // Navega a /pagosss y pasa el arriendo seleccionado en el estado
        navigate("/pagosss", { state: { arriendo } });
      };

      return (
        <Card
          items={arriendos}
          renderFields={(arriendo) => [
            { label: "numero arriendo", value: arriendo.numero },
            { label: "precio", value: arriendo.precio },
            { label: "estado", value: estado[arriendo.id_estado_arriendo] },
          ]}
          actions={(arriendo) => (
            <>
                <button onClick={() => handleContratarClick(arriendo)}>   Contratar </button> 
            </>
          )}
        />
      );
};





