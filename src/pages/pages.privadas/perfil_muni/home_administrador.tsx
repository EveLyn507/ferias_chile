/* eslint-disable react-hooks/exhaustive-deps */
//import { useSelector } from "react-redux";
import { Card_soli_muni } from "./components/card_soli"
//import { AppStore } from "../../../redux/store";
import { useEffect } from "react";
//import { solisaperService } from "./rxjs/soliaper";
import userWebSocketService from "../../models/webSoket";

export const Perfil_admin = () => {
  const WebSocketService = userWebSocketService.getInstance();

  useEffect(() => {
    const isSocketConnected = sessionStorage.getItem('socketConnected');

    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  // Marca como conectado
    }
  }, []); // Este effect solo se

  return (
   <>
   <h1>PERFIL ADMINISTRADOR MUNICIPAL</h1>
   <Card_soli_muni/>
   </>
  )
}