import { useEffect } from "react"
import { postulacionService } from "../../rxjs/rxjsPostulaciones"
import { CardPostulaciones } from "./cardPostulaciones"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { MisPostulaciones } from "./misPostulaciones"

export const HomePostulaciones = () => {


    useEffect(() => {
        postulacionService.loadInitialVacante()
    },[])

    useEffect(() => {
      // Aplica el estilo al body solo mientras el componente esté montado
      const originalBodyStyle = document.body.style.cssText;
      document.body.style.display = 'flex';
      document.body.style.justifyContent = 'center';
      document.body.style.alignItems = 'center';
      document.body.style.minHeight = '100vh';
      document.body.style.margin = '0';

      return () => {
          // Restaura el estilo original del body al desmontar el componente
          document.body.style.cssText = originalBodyStyle;
      };
  }, []);

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