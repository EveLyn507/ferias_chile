import { BehaviorSubject } from "rxjs";
import { solicitud } from "../../../models/interfaces";
import { confirmSoli, declineSoli, TraerSolisMunicipal } from "../services/traer_soli_municipal";

class soliAperService {

    private soliAperSubject = new BehaviorSubject<solicitud[]>([]);
    public sa$ = this.soliAperSubject.asObservable();


    setSA(solis : solicitud[]) {
        this.soliAperSubject.next(solis)
    }

    LoadInitialData(id_user_adm : number) {
        TraerSolisMunicipal(id_user_adm).then((res) => this.setSA(res)).
        catch((error ) => { console.error("Error al cargar ferias del encargado:", error)})
    }

    aceptarSoli(id_solicitud : number) {
        confirmSoli(id_solicitud ) 

        
    }

    declineSoli(id_solicitud : number) {
        declineSoli(id_solicitud)
    }

}

export const solisaperService = new soliAperService();