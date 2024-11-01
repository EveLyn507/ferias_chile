// bancos.service.ts
import { BehaviorSubject } from 'rxjs';
import {  getVacantesFeria } from '../services/admin_feria_fuctions';
import { vacante } from '../../../models/interfaces';



class VacanteService {
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

  // Función para cargar los bancos desde la base de datos, recibiendo el mail como argumento
  loadInitialVacante(mail: string , id_feria : number) {
    getVacantesFeria(mail,id_feria).then(vacante => {
      this.setVacante(vacante); // Actualiza la lista con los datos obtenidos
    }).catch(error => {
      console.error("Error al cargar las vacantes:", error);
    });
  }
}

export const vancanteService = new VacanteService();
