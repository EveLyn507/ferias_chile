// bancos.service.ts
import { BehaviorSubject } from 'rxjs';

import { getMiPostulacion } from '../services/postulacionesFunction';
import { Mispostulacion } from '../../../models/interfaces';



class miPostuService {
  private mipostuSubject = new BehaviorSubject<Mispostulacion[]>([]);
  public postulacion$ = this.mipostuSubject.asObservable();



  setVacante(postulacion: Mispostulacion[]) {
    this.mipostuSubject.next(postulacion);
  }


  
//para ver los post a los que aplique
LoadMisPostulaciones(id_user_fte : number) {
   
    getMiPostulacion(id_user_fte).then(post => {
      this.setVacante(post); // Actualiza la lista con los datos obtenidos
    }).catch(error => {
      console.error("Error al cargar las vacantes:", error);
    });
  
  }
}

export const MiPostuService = new  miPostuService();
