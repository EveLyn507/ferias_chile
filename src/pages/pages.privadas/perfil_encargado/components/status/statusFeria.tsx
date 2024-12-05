/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { recargaStatus } from "../../services/admin_feria_fuctions"
import { OpenTiket } from "../../services/open_tikek"
import { homeProps } from "../../../../models/interfaces"




export const StatusFeria = ({id_feria} : homeProps) => {

  const [stateButton, setStateButton] = useState<boolean>(true)
  const [estado , setEstado] = useState('')

const opTiket = async () => {
    await OpenTiket(id_feria)
    await recargar()
    }

const recargar = async () => {
  const state  = await recargaStatus(id_feria) 
  setEstado(state)
  return state === 'No enviada' || state === 'Rechazada' ? setStateButton(false) : setStateButton(true) 
  
}

useEffect(() => {
  recargar()

},[])



return (
  <>
    <span>status: {estado}</span>
    <button disabled={stateButton} onClick={() => opTiket()}>Solicitar apertura de feria</button>
    <button onClick={() => recargar()}>RECARGA</button>
      



  </>
);

}
