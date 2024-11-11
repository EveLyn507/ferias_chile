/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { recargaStatus } from "../../services/admin_feria_fuctions"
import { OpenTiket } from "../../services/open_tikek"
import { useParams } from "react-router-dom"




export const StatusFeria = () => {

  const [stateButton, setStateButton] = useState<boolean>(true)
  const [estado , setEstado] = useState('')

  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria, 10) : 0; // Se pasa hacia aca para que no quede como undefined o null

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
    <ul>
      <li>status de la feria: {estado}</li>
    </ul>
    <button disabled={stateButton} onClick={() => opTiket()}>Solicitar apertura de feria</button>
    <button onClick={() => recargar()}>RECARGA</button>
  </>
);

}
