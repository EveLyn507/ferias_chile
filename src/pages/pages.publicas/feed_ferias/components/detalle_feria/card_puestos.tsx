import './mapa/layer.css'
import { useNavigate } from "react-router-dom";
import { arriendo, arriendosListProp } from "./mapa/mapaModel";
import { useEffect } from 'react';

export const Card_arriendos = ({ arriendos }: arriendosListProp) => {
  const estado = ['none', 'disponible', 'en proceso venta', 'arrendado'];
  const navigate = useNavigate();

  const handleContratarClick = (arriendo: arriendo) => {
    navigate("/pagosss", { state: { arriendo } });
  };

  useEffect(() => {
    // Aplica el estilo al body solo mientras el componente esté montado
    const originalBodyStyle = document.body.style.cssText;
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';

    return () => {
        // Restaura el estilo original del body al desmontar el componente
        document.body.style.cssText = originalBodyStyle;
    };
}, []);

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
