/* eslint-disable react-hooks/exhaustive-deps */
import { NuevoBanco } from "./newbank";
import { CardDatosBank } from "./card_bancos";
import { useEffect } from "react";
import { bancoService } from "../../rxjs/sharingbankslist";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import "./banco.css";

const BancosHome = () => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);

useEffect(()=> {


  // Cargar los bancos iniciales desde el backend
  bancoService.loadInitialBancos(id_user_enf);
},[])

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
