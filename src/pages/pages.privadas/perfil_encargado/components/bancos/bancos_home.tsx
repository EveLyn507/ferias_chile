/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { getDatosBank } from "../../services/admin_feria_fuctions"
import { useSelector } from "react-redux"
import { AppStore } from "../../../../../redux/store"
import { DatosBank } from "../../../../models/interfaces"
import { CardDatosBank } from "./card_bancos"


export const Bancos_home = () => {

    const mail = useSelector((store : AppStore) => store.user.email)

    const [bancos , setBancos] = useState<DatosBank[]>([]);

    useEffect(() => {   

        getDatosBank(mail).then( (res: DatosBank[]) => {setBancos(res);}).
        catch((error ) => { console.error("Error al cargar ferias:", error)})

    }, [])

    console.log(bancos)
  return (
    <>
    <h2>holaaaaaaaaaaaaa</h2>


        <CardDatosBank   bancos={bancos}/>
    
    </>
  )
}