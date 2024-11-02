// bancos.service.ts
import { BehaviorSubject } from 'rxjs';

import { ftePostulacion } from '../../../models/interfaces';
import { getPostulacionesEnf } from '../services/admin_feria_fuctions';




class PostulacionesService {
  private postulacionSubject = new BehaviorSubject<ftePostulacion[]>([]);
  public postulacion$ = this.postulacionSubject.asObservable();


  setVacante(postulaciones: ftePostulacion[]) {
    this.postulacionSubject.next(postulaciones);
  }
 
  rechazarPostulacion(id_postulacion: number) {
    const currentPostulacion = this.postulacionSubject.getValue();
    const updatedPostulacion = currentPostulacion.filter(b => b.id_vacante !== id_postulacion);
    this.postulacionSubject.next(updatedPostulacion);
  }
 
  aceptarPostulacion(id_postulacion: number) {
    const currentPostulacion = this.postulacionSubject.getValue();
    const updatedPostulacion = currentPostulacion.filter(b => b.id_vacante !== id_postulacion);
    this.postulacionSubject.next(updatedPostulacion);
  }


  postulacionesFeriaFilter( id_feria : number) {
    const currentPostulacion = this.postulacionSubject.getValue();

    const idFeriaActual = id_feria; // Reemplaza esto con el id de la feria actual (puede venir de un parámetro o estado global)
    const filteredVacantes = currentPostulacion.filter(v => v.id_feria === idFeriaActual);

    this.postulacionSubject.next(filteredVacantes); 

  }

  // Función para cargar los bancos desde la base de datos, recibiendo el mail como argumento
  loadInitialVacante(id_user_enf : number) {
    getPostulacionesEnf(id_user_enf).then(postulaciones => {
      this.setVacante(postulaciones); // Actualiza la lista con los datos obtenidos
    }).catch(error => {
      console.error("Error al cargar las vacantes:", error);
    });
  }
}

export const postulacionService = new PostulacionesService();
