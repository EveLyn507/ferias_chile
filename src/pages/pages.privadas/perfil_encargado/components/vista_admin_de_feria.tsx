import { useEffect} from "react"
import { BancoFeria } from "./administrador_feria/datosBank"
import BooleanDaysSelector from "./administrador_feria/programa/programacion"
import { useSelector } from "react-redux"
import { AppStore } from "../../../../redux/store"
import { VacanteService } from "../rxjs/sharingVacantes"
import { bancoService } from "../rxjs/sharingbankslist"
import { EmpleadosFeria } from "./administrador_feria/vacantes/empleadosTable"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { StatusFeria } from "./status/statusFeria"
import { Feria } from "../../../models/interfaces"

interface adProps {
  feria : Feria
}

export const Admin_de_feria = ({feria} : adProps) => {
  

const nombre = feria.nombre_feria
const id_feria = feria.id_feria
const mail = useSelector((store : AppStore) => store.user.email ) // maild sacado de redux
const id_user_enf = useSelector((store : AppStore) => store.user.id_user)
  
useEffect(()=> {

  VacanteService.loadInitialVacante(mail, id_feria)
  bancoService.loadInitialBancos(id_user_enf)

})



return (
<>
      <header className="head-f">
      <h1>Administración {nombre}</h1>

      </header>
    <div className="f-content">


    <Tabs>
      <TabList >
        <Tab>VACANTES</Tab>
        <Tab>PROGRAMA</Tab>
        <Tab>BANCOS</Tab>
        <Tab>ESTATUS</Tab>

      </TabList>
      

      <TabPanel>
        <EmpleadosFeria id_feria={id_feria} nombreF={nombre} />
      </TabPanel>


      <TabPanel>
        <BooleanDaysSelector id_feria={id_feria} nombreF={nombre} />
      </TabPanel>

      <TabPanel>
        <BancoFeria id_feria={id_feria} nombreF={nombre} />
      </TabPanel> 

      <TabPanel>
      <div className="status-f">
      <StatusFeria id_feria={id_feria} nombreF={nombre} />
      </div>
      </TabPanel> 


      

    </Tabs>
    </div>
    </>
);
}