import { BehaviorSubject } from "rxjs";
import { solicitud } from "../../../models/interfaces";
import {  TraerSolisMunicipal } from "../services/traer_soli_municipal";

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

    aceptDeclineSoli(index: number, estado: string, id_estado: number) {
        const currentSolis = this.soliAperSubject.getValue(); // Obtiene el valor actual del Subject
    
        // Validar el índice
        if (index < 0 || index >= currentSolis.length) {
            console.error("Índice fuera de rango");
            return; // Sale de la función si el índice no es válido
        }
    
        // Crear una copia del array para no mutar el original
        const updatedSolis = [...currentSolis]; 
        updatedSolis[index] = { 
            ...updatedSolis[index], // Copia las propiedades actuales
            estado: estado,         // Actualiza el estado
            id_estado: id_estado     // Actualiza el id_estado
        };
    
        const filtersolis = updatedSolis.filter( b => b.id_estado === 1)
        // Emitir la lista actualizada
        this.soliAperSubject.next(filtersolis);
    }
    

}

export const solisaperService = new soliAperService();