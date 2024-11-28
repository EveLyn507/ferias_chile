// bancos.service.ts
import { BehaviorSubject } from 'rxjs';

import { vacante } from '../../../models/interfaces';



class PostulacionesService {
  private vacanteSubject = new BehaviorSubject<vacante[]>([]);
  public vacante$ = this.vacanteSubject.asObservable();



  setVacante(vacante: vacante[]) {
    this.vacanteSubject.next(vacante);
  }

  addVacante(vacante: vacante) {
    const currentVacantes = this.vacanteSubject.getValue();
    this.vacanteSubject.next([...currentVacantes, vacante]);
  }


  removeVacante(id_vacante: number) {
    const currentVacante = this.vacanteSubject.getValue();
    const updatedVacante = currentVacante.filter(b => b.id_vacante !== id_vacante);
    
    this.vacanteSubject.next(updatedVacante);
  }


  updateVacante(updatedVacante: vacante, id_feria : number) {
    const currentVacante = this.vacanteSubject.getValue();
    const actuVacante = currentVacante.map(b =>
      b.id_vacante === updatedVacante.id_vacante ? updatedVacante : b
    );
    const idFeriaActual = id_feria; // Reemplaza esto con el id de la feria actual (puede venir de un parámetro o estado global)
    const filteredVacantes = actuVacante.filter(v => v.id_feria === idFeriaActual);

    this.vacanteSubject.next(filteredVacantes); 

  }




}//fin


export const postulacionService = new PostulacionesService();
