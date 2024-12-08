
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { loadCompras } from "../../services/postulacionesFunction";
import "./MisCompras.css"; // Importamos el CSS

interface Compra {
  id_contrato: number;
  fecha_pago: string;
  id_arriendo_puesto: number;
  tipo_pago: string;
  estado_contrato: string;
  precio: number;
  buy_order: string;
  id_puesto: number;
  fecha_feria: string;
  numero: string;
  nombre_feria: string;
}

export const MisCompras = () => {
  const [compras, setCompras] = useState<Compra[] | null>(null);
  const id_user_fte = useSelector((store: AppStore) => store.user.id_user);

  useEffect(() => {
    loadCompras(id_user_fte)
      .then((res: Compra[]) => setCompras(res))
      .catch((error) => {
        console.log(error);
      });
  }, [id_user_fte]);

  return (
    <div className="compras-container">
      <h1>MIS COMPRAS</h1>
      {compras && compras.length > 0 ? (
        compras.map((compra) => (
          <div key={compra.id_contrato} className="compra-card">
            <h3 className="compra-card-title">Compra: {compra.buy_order}</h3>
            <p><strong>Feria:</strong> {compra.nombre_feria}</p>
            <p><strong>Fecha de Feria:</strong> {compra.fecha_feria}</p>
            <p><strong>Número de Puesto:</strong> {compra.numero}</p>
            <p><strong>Precio:</strong> ${compra.precio}</p>
            <p><strong>Fecha de Pago:</strong> {compra.fecha_pago}</p>
            <p><strong>Estado del Contrato:</strong> {compra.estado_contrato}</p>
          </div>
        ))
      ) : (
        <span className="no-compras">Aún no has registrado ninguna compra.</span>
      )}
    </div>
  );
};