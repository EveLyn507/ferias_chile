import { useEffect} from "react"
import { BancoFeria } from "./administrador_feria/datosBank"
import BooleanDaysSelector from "./administrador_feria/programacion"
import { useSelector } from "react-redux"
import { AppStore } from "../../../../redux/store"
import { VacanteService } from "../rxjs/sharingVacantes"
import { bancoService } from "../rxjs/sharingbankslist"
import { EmpleadosFeria } from "./administrador_feria/vacantes/empleados"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { StatusFeria } from "./status/statusFeria"
import { Feria } from "../../../models/interfaces"

interface adProps {
  feria : Feria
}

export const Admin_de_feria = ({feria} : adProps) => {
  

const nombre = feria.nombre_feria
const idFeria = feria.id_feria
const mail = useSelector((store : AppStore) => store.user.email ) // maild sacado de redux
const id_user_enf = useSelector((store : AppStore) => store.user.id_user)
  
useEffect(()=> {

  VacanteService.loadInitialVacante(mail, idFeria)
  bancoService.loadInitialBancos(id_user_enf)

})



return (
<>
      <header className="head-f">
      <h1>Administración {nombre}</h1>
      <div className="status-f">
      <StatusFeria idFeria={idFeria} nombreF={nombre} />
      </div>
      </header>
    <div className="f-content">


    <Tabs>
      <TabList >
        <Tab>VACANTES</Tab>
        <Tab>PROGRAMA</Tab>
        <Tab>BANCOS</Tab>
      </TabList>
      

      <TabPanel>
        <EmpleadosFeria idFeria={idFeria} nombreF={nombre} />
      </TabPanel>


      <TabPanel>
        <BooleanDaysSelector idFeria={idFeria} nombreF={nombre} />
      </TabPanel>

      <TabPanel>
        <BancoFeria idFeria={idFeria} nombreF={nombre} />
      </TabPanel> 


      

    </Tabs>
    </div>
    </>
);
}