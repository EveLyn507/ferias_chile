import { useEffect } from "react"
import { postulacionService } from "../../rxjs/rxjsPostulaciones"
import { CardPostulaciones } from "./cardPostulaciones"

export const HomePostulaciones = () => {


    useEffect(() => {
        postulacionService.loadInitialVacante()
    },[])



  return (
<>
<h1>PANEL DE POSTULACIONES</h1>
    <CardPostulaciones/>
    </>
  )
}