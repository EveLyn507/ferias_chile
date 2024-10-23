/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { bancoService } from "./rxjs/sharingbankslist";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { NuevoBanco } from "./newbank";
import { CardDatosBank } from "./card_bancos";

const BancosHome = () => {
  const mail = useSelector((store: AppStore) => store.user.email); // Obtener el mail del usuario

  useEffect(() => {
    if (mail) {
      bancoService.loadInitialBancos(mail); // Cargar la lista inicial de bancos
    }
  }, []); // Solo se ejecuta cuando cambia el mail

  return (

    <>
    
   
    <div>
      
      <NuevoBanco/>
    </div>

    <div>
<CardDatosBank/>

    </div>
    </>
  );
};

export default BancosHome;
