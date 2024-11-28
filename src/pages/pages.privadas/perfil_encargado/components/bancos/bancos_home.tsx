/* eslint-disable react-hooks/exhaustive-deps */ 
import { NuevoBanco } from "./newbank";
import { CardDatosBank } from "./card_bancos";
import { useEffect } from "react";
import { bancoService } from "../../rxjs/sharingbankslist";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import "./misBanco.css";

const BancosHome = () => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);

  useEffect(() => {
    bancoService.loadInitialBancos(id_user_enf);
  }, []);

  return (

      <div className="bancos-container">

        <div className="nuevo-banco">
          <NuevoBanco />
        </div>

        <div className="bancos-list">
          <CardDatosBank /> 
        </div>
      </div>

  );
};

export default BancosHome;
