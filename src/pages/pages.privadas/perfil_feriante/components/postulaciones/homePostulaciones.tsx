import { useEffect } from "react"
import { postulacionService } from "../../rxjs/rxjsPostulaciones"
import { CardPostulaciones } from "./cardPostulaciones"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { MisPostulaciones } from "./misPostulaciones"

export const HomePostulaciones = () => {


    useEffect(() => {
        postulacionService.loadInitialVacante()
    },[])



  return (
<>
<h1>PANEL DE EMPLEABILIDAD</h1>

<Tabs>

    <TabList>
      <Tab>Vacantes Disponibles</Tab>
      <Tab>Mis Postulaciones</Tab>
    </TabList>


    <TabPanel>
    <CardPostulaciones/>
    </TabPanel>

    <TabPanel>
    <MisPostulaciones/>
    </TabPanel>

</Tabs>
   
    </>
  )
}