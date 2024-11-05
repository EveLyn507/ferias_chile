/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { Card_soli_muni } from "./components/card_soli"
import { AppStore } from "../../../redux/store";
import { useEffect } from "react";
import { solisaperService } from "./rxjs/soliaper";

export const Perfil_admin = () => {


  const id_user_adm = useSelector((store : AppStore) => store.user.id_user )   
    useEffect((() => { 
      solisaperService.LoadInitialData(id_user_adm)
      
    }) ,[]);
    
  return (
   <>
   <h1>PERFIL ADMINISTRADOR MUNICIPAL</h1>
   <Card_soli_muni/>
   </>
  )
}