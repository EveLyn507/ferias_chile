

import { useEffect} from "react"
import { DatosBanco } from "./components/administrador_feria/datosBank"
import BooleanDaysSelector from "./components/administrador_feria/programacion"
import { useSelector } from "react-redux"
import { AppStore } from "../../../redux/store"
import { useParams } from "react-router-dom"
import { vancanteService } from "./rxjs/sharingVacantes"
import { bancoService } from "./rxjs/sharingbankslist"
import { CrearVacante } from "./components/administrador_feria/vacantes/newVacante"
import { EmpleadosFeria } from "./components/administrador_feria/vacantes/cardListVacantes"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"


export const Admin_de_feria = () => {
  
const {id_feria} = useParams<{id_feria :string }>();
const {nombre } = useParams<{nombre :string }>();
const idFeria =  id_feria ? parseInt(id_feria, 10)  : 0; // se pasa hacia aca para que no quede como undefined o null
const mail = useSelector((store : AppStore) => store.user.email ) // maild sacado de redux
  
useEffect(()=> {

  vancanteService.loadInitialVacante(mail, idFeria)
  bancoService.loadInitialBancos(mail)
})

  return (



    <> 


<h1> Administracion de {nombre}</h1>


<Tabs>
            <TabList>
                <Tab>VACANTES </Tab>
                <Tab>POSTULANTES</Tab>
                <Tab>PROGRAMA</Tab>
                <Tab>BANCOS</Tab>
            </TabList>
            
            <TabPanel>
            <CrearVacante/>
            <EmpleadosFeria/>
            </TabPanel>
            

            <TabPanel>

            </TabPanel>


            <TabPanel>
            <BooleanDaysSelector/>
    
            </TabPanel>

            <TabPanel>
            <DatosBanco/>
            </TabPanel>

        </Tabs>

    </>
  )
}