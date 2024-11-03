/* eslint-disable react-hooks/exhaustive-deps */
import { OpenTiket } from "../../services/open_tikek"
import { useEffect, useState } from "react"
import { feriasService } from "../../rxjs/sharingFeriasEn"
import { useParams } from "react-router-dom"




export const StatusFeria = () => {
    const { id_feria } = useParams<{ id_feria: string }>();
    const idFeria = id_feria ? parseInt(id_feria, 10) : 0; // Se pasa hacia aca para que no quede como undefined o null


const opTiket =async () => {
    const ok = await OpenTiket(idFeria)
    if (ok === 200){
        setStateButton(false)
    }

}

const [stateButton, setStateButton] = useState<boolean>(false)

const [status, setStatus] = useState<string>('vacio');

const storedValue = localStorage.getItem('feriasStatus') ;
const estados = storedValue ? JSON.parse(storedValue) : ''

const state = estados[idFeria]

console.log(status , state);


useEffect(() => {
  // Llama a getStatus para obtener el estado de la feria al montar el componente
  const estado = feriasService.getStatus(idFeria);
  setStatus(estado);


  if(status === 'No enviada'){
    setStateButton(false)
 
}   else{
    setStateButton(true)
}


}, []);



  return (
    <>
   <li>status de la feria : {status}</li>
   <button  disabled={stateButton} onClick={() =>opTiket() }>Solicitar apertura de feria</button> 
   </>
  )
}