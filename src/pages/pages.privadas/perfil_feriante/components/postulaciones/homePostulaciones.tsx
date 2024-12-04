import {  useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { MisPostulaciones } from "./misPostulaciones/misPostulaciones"
import { Filtros_base } from "../../../../../components/filtros"
import  fteHome from './homePostu.module.css'
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
      <div className= {fteHome["postulacion-container"]} >

  
      <div className= {fteHome["postu-filter"]} >
      <Filtros_base onFilterC={setSelectedComuna} onFilterR={setSelectedRegion}/>
      </div>
      <div className={fteHome["search"]} >
      <button onClick={() => filtrar()}> Realizar Busqueda</button>
      </div>

      <div className = {fteHome["cards-container"]}>
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