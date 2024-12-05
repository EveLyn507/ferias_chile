import './mapa/layer.css'
import { useNavigate } from "react-router-dom";
import { arriendo, arriendosListProp } from "./mapa/mapaModel";


export const Card_arriendos = ({ arriendos }: arriendosListProp) => {
  const estado = ['none', 'disponible', 'en proceso venta', 'arrendado'];
  const navigate = useNavigate();

console.log(arriendos);

  const handleContratarClick = (arriendo: arriendo) => {
    navigate("/pagosss", { state: { arriendo } });
  };



  return (
    <div className="scrollable-container-card-arriendos">
      {arriendos.map((arriendo) => (
        <div className="card-arriendos" key={arriendo.numero}>
          <div className="card-arriendos-label">Número arriendo:</div>
          <div className="card-arriendos-value">{arriendo.numero}</div>
          
          <div className="card-arriendos-label">Precio:</div>
          <div className="card-arriendos-value">${arriendo.precio}</div>
          
          <div className="card-arriendos-label">Estado:</div>
          <div className="card-arriendos-value">{estado[arriendo.id_estado_arriendo]}</div>
          
          <button className="card-arriendos-button" onClick={() => handleContratarClick(arriendo)}>
            Contratar
          </button>
        </div>
      ))}
    </div>
  );
};
