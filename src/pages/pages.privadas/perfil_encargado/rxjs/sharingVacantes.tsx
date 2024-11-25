// bancos.service.ts
import { BehaviorSubject } from 'rxjs';
import { getVacantesFeria } from '../services/admin_feria_fuctions';
import { vacante } from '../../../models/interfaces';

class vacanteService {
  // vacanteSubject ahora maneja un Map donde la clave es id_vacante
  private vacanteSubject = new BehaviorSubject<Map<number, vacante>>(new Map());
  public vacante$ = this.vacanteSubject.asObservable();

  // Establecer las vacantes en el Map, donde id_vacante es la clave
  setVacante(vacantes: vacante[]) {
    const vacanteMap = new Map(vacantes.map(v => [v.id_vacante, v]));
    this.vacanteSubject.next(vacanteMap);
  }

  // Añadir una nueva vacante al Map, usando id_vacante como clave
  addVacante(vacante: vacante) {
    const currentVacantes = this.vacanteSubject.getValue();
    currentVacantes.set(vacante.id_vacante, vacante); // Usamos id_vacante como clave
    this.vacanteSubject.next(new Map(currentVacantes)); // Actualizamos el Map
  }

  // Eliminar una vacante usando su id_vacante como clave
  removeVacante(id_vacante: number) {
    const currentVacantes = this.vacanteSubject.getValue();
    currentVacantes.delete(id_vacante); // Eliminamos la vacante con el id_vacante correspondiente
    this.vacanteSubject.next(new Map(currentVacantes)); // Actualizamos el Map
  }

  // Actualizar una vacante en el Map, manteniendo el id_vacante como clave
  updateVacante(updatedVacante: vacante, id_feria: number) {
    const currentVacantes = this.vacanteSubject.getValue();
    if (currentVacantes.has(updatedVacante.id_vacante)) {
      currentVacantes.set(updatedVacante.id_vacante, updatedVacante); // Actualizamos la vacante en el Map
    }
    
    const idFeriaActual = id_feria; // Reemplaza esto con el id de la feria actual (puede venir de un parámetro o estado global)
    const filteredVacantes = Array.from(currentVacantes.values()).filter(v => v.id_feria === idFeriaActual);

    // Se mantiene el Map filtrado
    const filteredVacantesMap = new Map(filteredVacantes.map(v => [v.id_vacante, v]));
    this.vacanteSubject.next(filteredVacantesMap);
  }

  // Función para cargar las vacantes desde la base de datos, recibiendo el mail como argumento
  loadInitialVacante(mail: string, id_feria: number) {
    getVacantesFeria(mail, id_feria).then(vacantes => {
      this.setVacante(vacantes); // Actualiza la lista con los datos obtenidos
    }).catch(error => {
      console.error("Error al cargar las vacantes:", error);
    });
  }
}

export const VacanteService = new vacanteService();
