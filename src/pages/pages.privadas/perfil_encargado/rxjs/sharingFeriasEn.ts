import { BehaviorSubject } from "rxjs";
import { Feria } from "../../../models/interfaces";
import { TraerFeriasEncargado } from "../services/traer_ferias_encargado";

class FeriasEnService {
    private feriasEnSubject = new BehaviorSubject<Feria[]>([]);
    public ferias$ = this.feriasEnSubject.asObservable();

    // Establece la lista de ferias
    setFerias(ferias: Feria[]) {
        this.feriasEnSubject.next(ferias);

        // Extrae solo los estados de cada feria y guarda en localStorage
        const estados = ferias.reduce((acc, feria) => {
            acc[feria.id_feria] = feria.estado;
            return acc;
        }, {} as Record<number, string>);

        localStorage.setItem("feriasStatus", JSON.stringify(estados));
    }

    // Obtiene el estado de una feria por su ID, con fallback a localStorage si es necesario
    getStatus(id_feria: number): string {
        const ferias = this.feriasEnSubject.getValue();
        const feria = ferias.find(f => f.id_feria === id_feria);

        if (feria) {
            return feria.estado;
        } else {
            // Si la feria no está en el estado, busca en localStorage
            const storedEstados = localStorage.getItem("feriasStatus");
            if (storedEstados) {
                const estados = JSON.parse(storedEstados);
                return estados[id_feria] || 'vacio';
            }
            return 'vacio';
        }
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
