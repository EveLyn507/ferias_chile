import {  useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { MisPostulaciones } from "./misPostulaciones/misPostulaciones"
import { Filtros_base } from "../../../../../components/filtros"
import './homePostu.css'
import { getFeriasConVacantesVacias } from "../../services/postulacionesFunction"
import { FeriasTable } from "./PortalEmpleo/feriasTable"
import { feriaVacante } from "./interfaces"

export const HomePostulaciones = () => {
  const [selectedComuna, setSelectedComuna] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [vacantesFeria, setVacantesFeria] = useState<feriaVacante[] | null>(null)

  
    const filtrar = async () => {
   
        const feriasConVacantes = await getFeriasConVacantesVacias(selectedComuna, selectedRegion) 
        setVacantesFeria(feriasConVacantes)
    }



  return (
<>
<h1>PANEL DE EMPLEABILIDAD</h1>

<Tabs>

    <TabList>
      <Tab>Vacantes</Tab>
      <Tab>Mis Postulaciones</Tab>
    </TabList>


    <TabPanel>
      <div className="postulacion-container">

  
      <div className="postu-filter">
      <Filtros_base onFilterC={setSelectedComuna} onFilterR={setSelectedRegion}/>
      </div>
      <div className="search">
      <button onClick={() => filtrar()}> Realizar Busqueda</button>
      </div>

      <div className="cards-container">
    <FeriasTable ferias={vacantesFeria}/>
    </div>
    </div>

    </TabPanel>

    <TabPanel>

    <MisPostulaciones/>

    </TabPanel>

</Tabs>
   
    </>
  )
}