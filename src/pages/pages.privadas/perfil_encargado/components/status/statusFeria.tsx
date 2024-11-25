/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { recargaStatus } from "../../services/admin_feria_fuctions"
import { OpenTiket } from "../../services/open_tikek"
import { homeProps } from "../../../../models/interfaces"
import { Link } from "react-router-dom"




export const StatusFeria = ({idFeria} : homeProps) => {

  const [stateButton, setStateButton] = useState<boolean>(true)
  const [estado , setEstado] = useState('')


console.log(estado)
const opTiket =async () => {
    await OpenTiket(idFeria)
    await recargar()
    }

const recargar = async () => {
  const state  = await recargaStatus(idFeria) 
  setEstado(state)
  return state === 'No enviada' ? setStateButton(false) : setStateButton(true) 
  
}

useEffect(() => {
  recargar()

},[])



return (
  <>
    <span>status: {estado}</span>
    <button disabled={stateButton} onClick={() => opTiket()}>Solicitar apertura de feria</button>
    <button onClick={() => recargar()}>RECARGA</button>
      
    <Link to={`Plano/${idFeria}`}> ir a mi plano </Link>


  </>
);

}
