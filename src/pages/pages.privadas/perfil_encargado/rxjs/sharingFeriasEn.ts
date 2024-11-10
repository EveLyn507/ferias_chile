import { BehaviorSubject } from "rxjs";
import { Feria } from "../../../models/interfaces";
import { TraerFeriasEncargado } from "../services/traer_ferias_encargado";

class FeriasEnService {
    private feriasEnSubject = new BehaviorSubject<Feria[]>([]);
    public ferias$ = this.feriasEnSubject.asObservable();

    // Establece la lista de ferias
    setFerias(ferias: Feria[]) {
        this.feriasEnSubject.next(ferias);
    }
    
    // Carga los datos iniciales de las ferias del encargado
    async loadInitialData(id_user_enf: number) {
        try {
            const ferias = await TraerFeriasEncargado(id_user_enf);
            this.setFerias(ferias);
        } catch (error) {
            console.log('Error al cargar las ferias del encargado', error);
        }
    }
}

export const feriasService = new FeriasEnService();
