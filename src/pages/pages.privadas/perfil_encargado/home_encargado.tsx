/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { PrivateRoutes } from "../../../models";
import { Card_feria_encargado } from "./components/ferias_d_encargado/card_feria_encargado";
import { useEffect } from "react";
import { feriasService } from "./rxjs/sharingFeriasEn";
import { useSelector } from "react-redux";
import { AppStore } from "../../../redux/store";
import './perfil_e.css';
import userWebSocketService from "../../models/webSoket";


const PerfilEn = () => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);
  const WebSocketService = userWebSocketService.getInstance();

  // Conexión WebSocket solo si no está conectado y no se ha realizado previamente
  useEffect(() => {
    const isSocketConnected = sessionStorage.getItem('socketConnected');

    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  // Marca como conectado
    }
  }, []); // Este effect solo se ejecuta una vez cuando el componente se monta

  // Carga de datos iniciales
  useEffect(() => {
    if (id_user_enf) {
      feriasService.loadInitialData(id_user_enf);
    }
  }, [id_user_enf]); // Se ejecuta cuando id_user_enf cambia

  // Manejo de estilos globales para centrar el contenido
  useEffect(() => {
    const originalBodyStyle = document.body.style.cssText;
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';

    // Limpieza del estilo original al desmontar el componente
    return () => {
      document.body.style.cssText = originalBodyStyle;
    };
  }, []); // Este effect solo se ejecuta una vez

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
