import { Link } from "react-router-dom";
import { PrivateRoutes } from "../../../models";
import { Card_feria_encargado } from "./components/ferias_d_encargado/card_feria_encargado";
import { useEffect } from "react";
import { feriasService } from "./rxjs/sharingFeriasEn";
import { useSelector } from "react-redux";
import { AppStore } from "../../../redux/store";
import './perfil_e.css'

const PerfilEn = () => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);

  useEffect(() => {
    feriasService.loadInitialData(id_user_enf);
  }, [id_user_enf]);

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
    <div className="perfil-container">
      <h1>PERFIL ENCARGADO DE LAS FERIAS</h1>

      <div className="card-container">
        <Card_feria_encargado />
      </div>

      <ul>
        <li>
          <Link to={`${PrivateRoutes.BANCOS}`}>BANCOS</Link>
        </li>
        <li>
          <Link to="TEAM">EMPLEADOS</Link>
        </li>
      </ul>
    </div>
  );
};

export default PerfilEn;
